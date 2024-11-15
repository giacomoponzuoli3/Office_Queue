import { describe, beforeEach, test, expect, jest, afterAll, beforeAll } from "@jest/globals";
import request from 'supertest';
import CounterController from "../../src/controllers/counterController"; 
import CounterDAO from "../../src/dao/counterDAO"; 
import { Counter } from "../../src/components/counter";
import { Service } from "../../src/components/service";
import { app } from "../../index";
import { cleanup } from "../../src/db/cleanup";
import { setup} from "../../src/db/setup";
import db from "../../src/db/db";

const baseURL = "/officequeue/counters";
const testCounter = new Counter(1, "Counter1");
const newCounter = new Counter(1, "CounterX");
const testService = new Service(1,"Service1",10);
const testId = 1;
const testName = "Counter1";
const newName = "CounterX";

beforeEach(async () => {
    await cleanup();
    jest.clearAllMocks(); // Clear mocks after each test
});

beforeAll(async () => {
    await setup();
});

afterAll(async () => {
    // Close the database connection
    await new Promise<void>((resolve, reject) => {
        db.close((err) => {
            if (err) reject(err);
            resolve();
        });
    });
});

describe('counterController/counterRoutes Integration tests', () => {
    describe('POST /', () => {
        test('It should register a counter and return 200 status', async () => {
            const response = await request(app).post(baseURL + `/`).send({ name: testName });
            expect(response.status).toBe(200);

            const getResponse = await request(app).get(baseURL + `/${testId}`);
            expect(getResponse.body).toEqual(testCounter);
        });

        test('It should return 422 status if the body is missing', async () => {
            await request(app).post(baseURL + `/`).send().expect(422);
        });

        test('It should return 422 status if the name is an empty string', async () => {
            await request(app).post(baseURL + `/`).send({ name: "" }).expect(422);
        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(CounterDAO.prototype, 'addCounter').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .post(baseURL + `/`)
                .send({ name: testName });

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('GET /:id', () => {
        test('It should retrieve a counter and return 200 status', async () => {
             const response = await request(app).post(baseURL + `/`).send({ name: testName });
            expect(response.status).toBe(200);

            const getResponse = await request(app).get(baseURL + `/${testId}`);
            expect(getResponse.body).toEqual(testCounter);
        });

        test('It should return 422 status if the param is not an integer', async () => {
            await request(app).get(baseURL + `/abc`).expect(422);
        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(CounterDAO.prototype, 'getCounter').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .get(baseURL + `/${testId}`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('GET /', () => {
        test('It should retrieve all counters and return 200 status', async () => {
            const response = await request(app).post(baseURL + `/`).send({ name: testName });
            expect(response.status).toBe(200);

            const getResponse = await request(app).get(baseURL + `/`);
            expect(getResponse.body).toEqual([testCounter]);
        });

        test('It should return an empty array if there are no counters and return 200 status', async () => {

            const getResponse = await request(app).get(baseURL + `/`);
            expect(getResponse.body).toEqual([]);

        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(CounterDAO.prototype, 'getAllCounters').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .get(baseURL + `/`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('POST /:id', () => {

        test('It should update a counter and return 200 status', async () => {
          
            await request(app).post(baseURL + `/`).send({ name: testName }).expect(200);
        
            let getResponse = await request(app).get(baseURL + `/${testId}`);
            expect(getResponse.body).toEqual(testCounter);
            expect(getResponse.status).toBe(200);

            await request(app).post(baseURL + `/${testId}`).send({ name: newName }).expect(200);
        
            getResponse = await request(app).get(baseURL + `/${testId}`);
            expect(getResponse.body).toEqual(newCounter);
            expect(getResponse.status).toBe(200);
            
        });

        test('It should return 422 status if the param is not an integer', async () => {

            let response = await request(app).post(baseURL + `/abc`).send({ name: testName });
            expect(response.status).toBe(422);

        });

        test('It should return 422 status if the bosy is missing', async () => {

            let response = await request(app).post(baseURL + `/abc`).send({});
            expect(response.status).toBe(422);

        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(CounterDAO.prototype, 'editCounter').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .post(baseURL + `/${testId}`)
                .send({ name: newName });

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('DELETE /:id', () => {
        test('It should delete a counter and return 200 status', async () => {
            await request(app).post(baseURL + `/`).send({ name: testName }).expect(200);
        
            let getResponse = await request(app).get(baseURL + `/${testId}`);
            expect(getResponse.body).toEqual(testCounter);
            expect(getResponse.status).toBe(200);

            await request(app).delete(baseURL + `/${testId}`).expect(200);
        
            getResponse = await request(app).get(baseURL + `/${testId}`);
            expect(getResponse.body.error).toBe('Internal Server Error');
            expect(getResponse.status).toBe(503);
        });

        test('It should return 422 status if the param is not an integer', async () => {
            const response = await request(app).delete(baseURL + `/abc`);

            expect(response.status).toBe(422);
        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(CounterDAO.prototype, 'deleteCounter').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .delete(baseURL + `/${testId}`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('POST /:counterid/services/:serviceid', () => {
        test('It should add a service to the counter and return 200 status', async () => {
            await request(app).post(baseURL + `/`).send({ name: testName }).expect(200);

            await request(app).post(`/officequeue/services/`).send({ name: "Service1", serviceTime: 10 }).expect(200);

            await request(app).post(baseURL + `/${testId}/services/${testId}`).expect(200);

            const response = await request(app).get(baseURL+`/${testId}/services`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([testService]);
      
        });

        test('It should add return 422 status if counterid is not an integer', async () => {

            await request(app).post(baseURL + `/abc/services/${testId}`).expect(422);

        });

        test('It should add return 422 status if serverid is not an integer', async () => {

            await request(app).post(baseURL + `/${testId}/services/abc`).expect(422);

        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(CounterDAO.prototype, 'addCounterService').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .post(baseURL + `/${testId}/services/${testId}`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });

    });

    describe('DELETE /:counterid/services/:serviceid', () => {

        test('It should delete a service from the counter and return 200 status', async () => {
            await request(app).post(baseURL + `/`).send({ name: testName }).expect(200);

            await request(app).post(`/officequeue/services/`).send({ name: "Service1", serviceTime: 10 }).expect(200);

            await request(app).post(baseURL + `/${testId}/services/${testId}`).expect(200);

            let response = await request(app).get(baseURL+`/${testId}/services`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([testService]);

            await request(app).delete(baseURL + `/${testId}/services/${testId}`).expect(200);

            response = await request(app).get(baseURL+`/${testId}/services`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);

        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(CounterDAO.prototype, 'deleteCounterService').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .delete(baseURL + `/${testId}/services/${testId}`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
        
    });

    describe('GET /:counterid/services', () => {

        test('It should view all services by counter and return 200 status', async () => {
            await request(app).post(baseURL + `/`).send({ name: testName }).expect(200);

            await request(app).post(`/officequeue/services/`).send({ name: "Service1", serviceTime: 10 }).expect(200);

            await request(app).post(baseURL + `/${testId}/services/${testId}`).expect(200);

            const response = await request(app).get(baseURL+`/${testId}/services`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([testService]);
        });


        test('It should return an empty array if there are no services and return 200 status', async () => {
            const response = await request(app).get(baseURL+`/${testId}/services`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });


        test('It should add return 422 status if counterid is not an integer', async () => {
            const response = await request(app).get(baseURL+`/abc/services`);

            expect(response.status).toBe(422);
        });

        test('It should return 503 if there is an error', async () => {
             jest.spyOn(CounterDAO.prototype, "viewAllServicesByCounterToday").mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app).get(baseURL+`/${testId}/services`);

            expect(response.status).toBe(503);
        });
    });


});
