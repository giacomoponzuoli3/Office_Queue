import { describe, beforeEach, test, expect, jest, afterAll, beforeAll } from "@jest/globals";
import request from 'supertest';
import ServiceController from "../../src/controllers/serviceController";
import ServiceDAO from "../../src/dao/serviceDAO";
import QueueDAO from "../../src/dao/queueDAO";
import CounterDAO from "../../src/dao/counterDAO";
import { Service } from "../../src/components/service";
import { app } from "../../index";
import { cleanup } from "../../src/db/cleanup";
import { setup } from "../../src/db/setup";
import db from "../../src/db/db";

const baseURL = "/officequeue/services";
const controller = new ServiceController();
const queueDAO = new QueueDAO();
const serviceDAO = new ServiceDAO();
const counterDAO = new CounterDAO();
const testName = "Service1";
const testId = 1;
const testTime = 10;
const newServiceTime = 15;
const testService = new Service(testId, testName, testTime);
const updatedService = new Service(testId, "", newServiceTime);
const date = new Date();

beforeEach(async () => {
    await cleanup();
    jest.clearAllMocks(); // Clear mocks after each test
});

beforeAll(async () => {
    await setup();
});

afterAll(async () => {
    await cleanup(); 
    // Close the database connection
    await new Promise<void>((resolve, reject) => {
        db.close((err) => {
            if (err) reject(err);
            resolve();
        });
    });
});

describe('serviceController/serviceRoutes Integration tests', () => {
    describe('POST /', () => {
        test('It should register a service and return 200 status', async () => {
            await request(app).post(baseURL + `/`).send({ name: testName, serviceTime: testTime }).expect(200);

            const response = await request(app).get(baseURL + `/${testId}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(testService);
        });

        test('It should return 422 status if the body is missing', async () => {
            await request(app).post(baseURL + `/`).send({}).expect(422);
        });

        test('It should return 422 status if the service name is a string with length less than 3', async () => {
            await request(app).post(baseURL + `/`).send({ name: "ab", serviceTime: testTime }).expect(422);
        });

        test('It should return 422 status if the service time is not a number', async () => {
            await request(app).post(baseURL + `/`).send({ name: testName, serviceTime: "testTime" }).expect(422);
        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(ServiceDAO.prototype, 'addService').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app).post(baseURL + `/`).send({ name: testName, serviceTime: testTime }).expect(200);
            expect(response.body.error).toBe('Internal Server Error');
        });

    });

    describe('GET /:id', () => {
        test('It should retrieve a specific service and return 200', async () => {
            await request(app).post(baseURL + `/`).send({ name: testName, serviceTime: testTime }).expect(503);

            const response = await request(app).get(baseURL + `/${testId}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(testService);
        });

        test('It should return 422 if the service id is not numeric', async () => {
            await request(app).get(baseURL + `/abc`).expect(422);
        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(ServiceDAO.prototype, 'getService').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app).get(baseURL + `/${testId}`).send({ name: testName, serviceTime: testTime }).expect(503);
            expect(response.body.error).toBe('Internal Server Error');
        });

    });

    describe('GET /', () => {
        test('It should retrieve all services and return 200', async () => {
            await request(app).post(baseURL + `/`).send({ name: testName, serviceTime: testTime }).expect(200);

            const response = await request(app).get(baseURL + `/`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual([testService]); 
        });
    
        test('It should return an empty array if no services exist', async () => {
            const response = await request(app).get(baseURL + `/`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]); 
        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(ServiceDAO.prototype, 'getServices').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app).get(baseURL + `/`).send({ name: testName, serviceTime: testTime }).expect(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
  
    });

    describe('PATCH /:name', () => {
        test('It should update a service and return 200', async () => {
            await request(app).post(baseURL + `/`).send({ name: testName, serviceTime: testTime }).expect(200);

            const response = await request(app).patch(baseURL + `/${testName}`).send({ newName: "", serviceTime: newServiceTime });
            expect(response.status).toBe(200);

            const updatedResponse = await request(app).get(baseURL + `/${testId}`);
            expect(updatedResponse.body).toEqual(updatedService);
        });

        test('It should return 422 if the new service name is missing', async () => {
            await request(app).post(baseURL + `/`).send({ name: testName, serviceTime: testTime }).expect(200);

            await request(app).patch(baseURL + `/${testName}`).send({ serviceTime: newServiceTime }).expect(422);
        });

        test('It should return 422 if the new service time is missing', async () => {
            await request(app).post(baseURL + `/`).send({ name: testName, serviceTime: testTime }).expect(200);

            await request(app).patch(baseURL + `/${testName}`).send({newName: ""}).expect(422);
        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(ServiceDAO.prototype, 'editService').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app).patch(baseURL + `/${testName}`).send({ newName: testName, serviceTime: testTime }).expect(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('DELETE /:name', () => {
        test('It should delete a service and return 200', async () => {
            await request(app).post(baseURL + `/`).send({ name: testName, serviceTime: testTime }).expect(200);

            const deleteResponse = await request(app).delete(baseURL + `/${testName}`);
            expect(deleteResponse.status).toBe(200);

            const getResponse = await request(app).get(baseURL + `/${testId}`);
            expect(getResponse.body.error).toBe('Internal Server Error');
            expect(getResponse.status).toBe(503);
        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(ServiceDAO.prototype, 'deleteService').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app).delete(baseURL + `/${testName}`).expect(503);
            expect(response.body.error).toBe('Internal Server Error');
        });

    });

    describe("Integration of GET officequeue/services/waitingtime/:id", () => {
        async function createCounters() {
            await counterDAO.addCounter("Counter 1");
            await counterDAO.addCounter("Counter 2");
            await counterDAO.addCounter("Counter 3");
            await counterDAO.addCounter("Counter 4");
            await counterDAO.addCounter("Counter 5");
            await counterDAO.addCounter("Counter 6");
            await counterDAO.addCounter("Counter 7");
            await counterDAO.addCounter("Counter 8");
            await counterDAO.addCounter("Counter 9");
            await counterDAO.addCounter("Counter 10");
        }
        
        async function createServices() {
            await serviceDAO.addService("Financial Services", 10);
            await serviceDAO.addService("Payment Services", 7);
            await serviceDAO.addService("International Services", 12);
            await serviceDAO.addService("Information", 5);
            await serviceDAO.addService("Delivery", 8);
        }
        
        async function createCounterServices(){
            await counterDAO.addCounterService(1,1);
            await counterDAO.addCounterService(1,2);
            await counterDAO.addCounterService(2,3);
            await counterDAO.addCounterService(2,4);
            await counterDAO.addCounterService(3,5);
            await counterDAO.addCounterService(3,1);
        }

        async function createQueues() {
            await queueDAO.addQueue("1", date);
            await queueDAO.addQueue("2", date);
            await queueDAO.addQueue("3", date);
            await queueDAO.addQueue("4", date);
            await queueDAO.addQueue("5", date);
        }

        test("get estimated time",async () => {
            await cleanup();
            //insert services at the counters
            await createCounterServices();
            //insert queues
            await createQueues();
            //insert ticket
            await db.run("INSERT INTO ticket(serviceId, position_queue, is_served) VALUES(1,1,0)");
            await db.run("INSERT INTO ticket(serviceId, position_queue, is_served) VALUES(1,2,0)");
            await db.run("INSERT INTO ticket(serviceId, position_queue, is_served) VALUES(1,3,0)");
            await db.run("INSERT INTO ticket(serviceId, position_queue, is_served) VALUES(1,4,0)");

            //insert customer to queue
            await queueDAO.addCustomerToQueue("1", new Date());
            await queueDAO.addCustomerToQueue("1", new Date());
            await queueDAO.addCustomerToQueue("1", new Date());
            await queueDAO.addCustomerToQueue("1", new Date());
            await queueDAO.addCustomerToQueue("1", new Date());

            //get estimated time
            const response = await request(app)
                                    .get(`${baseURL}waitingtime/1`);
            
            expect(response.status).toBe(200);
        })
    })
});
