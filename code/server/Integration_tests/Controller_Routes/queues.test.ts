import { test, expect, jest, afterEach, beforeAll, afterAll, describe } from "@jest/globals";
import request from 'supertest';
import QueueController from "../../src/controllers/queueController";
import { Queue } from "../../src/components/queue";
import { Ticket } from "../../src/components/ticket";
import { app } from "../../index";
import db from "../../src/db/db"
import QueueDAO from "../../src/dao/queueDAO"
import TicketDAO from "../../src/dao/ticketDAO"
import ServiceController from "../../src/controllers/serviceController"
import CounterController from "../../src/controllers/counterController"
import { setup } from "../../src/db/setup";
import { cleanup } from "../../src/db/cleanup";

const baseURL = "/officequeue/queues";

const date = new Date();
const testDate = date.toDateString();
const testId = "1";
const testId2 = "2";
const queue_input = new Queue(1, date, 0);
const queue_plus = new Queue(1, date, 1);
const serviceController = new ServiceController();
const counterController = new CounterController();
const controller = new QueueController();
const dao = new QueueDAO();
const ticketDAO = new TicketDAO();
const testName = "service x";
const testTime = 10;


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

afterEach(async () => {
    await cleanup();
});

describe("queueController/queueDAO Integration tests", () => {
    describe('POST /', () => {
        test("It should add a queue and return 200", async () => {

            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();
            await expect(request(app).post(baseURL + "/").send({ serviceId: testId, date: testDate })).resolves.toBe(200);


            expect(controller.addQueue).toHaveBeenCalledWith(testId, date);

            const response = await request(app)
                .get(baseURL + `/${testId}/${testDate}`);

            expect(response.body).toEqual(queue_input);
        });

        test("It should return 422 if the serviceId is not a string", async () => {

            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();

            await expect(request(app).post(baseURL + "/").send({ serviceId: 1, date: testDate })).resolves.toBe(422);
        });

        test("It should return 422 if the date is not a string", async () => {
            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();

            const response = await request(app)
                .post(baseURL + "/")
                .send({ serviceId: testId, date: 1 });

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the serviceId is empty", async () => {
            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();

            const response = await request(app)
                .post(baseURL + "/")
                .send({ serviceId: "", date: testDate });

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the date is empty", async () => {
            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();

            const response = await request(app)
                .post(baseURL + "/")
                .send({ serviceId: testId, date: "" });

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the body is missing", async () => {
            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();

            const response = await request(app)
                .post(baseURL + "/")
                .send({});

            expect(response.status).toBe(422);
        });

        test('It should return 503 if there is an error', async () => {
            const error = await controller.addQueue(testId, date);

            const response = await request(app)
                .post(baseURL + "/")
                .send({ serviceId: testId, date: testDate });

            expect(response.status).toBe(503);
            expect(response.body.error).toBe(error);
        });
    });

    describe('GET /:serviceId/:date', () => {
        test('It should retrieve a queue and return 200', async () => {
            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();
            await expect(request(app).post(baseURL + "/").send({ serviceId: testId, date: testDate })).resolves.toBe(200);

            const response = await request(app)
                .get(baseURL + `/${testId}/${testDate}`);

            expect(response.status).toBe(200);
            expect(controller.getQueue).toHaveBeenCalledWith(testId, date);
            expect(response.body).toEqual(queue_input);
        });

        test("It should return 422 if the serviceId is not a string", async () => {

            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();
            await expect(request(app).post(baseURL + "/").send({ serviceId: testId, date: testDate })).resolves.toBe(200);

            const response = await request(app)
                .get(baseURL + `/` + 1 + `/${testDate}`);

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the date is not a string", async () => {

            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();
            await expect(request(app).post(baseURL + "/").send({ serviceId: testId, date: testDate })).resolves.toBe(200);

            const response = await request(app)
                .get(baseURL + `/1/` + 1);

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the serviceId is empty", async () => {

            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();
            await expect(request(app).post(baseURL + "/").send({ serviceId: testId, date: testDate })).resolves.toBe(200);

            const response = await request(app)
                .get(baseURL + `/ /${testDate}`);

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the date is empty", async () => {

            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();
            await expect(request(app).post(baseURL + "/").send({ serviceId: testId, date: testDate })).resolves.toBe(200);

            const response = await request(app)
                .get(baseURL + `/${testId}/`);

            expect(response.status).toBe(422);
        });

        test("It should return 503 if there is an error", async () => {

            const response = await request(app)
                .get(`${baseURL}/${testId}/${testDate}`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe("No queue found with specified id");

        });
    });

    describe('PATCH /:serviceId/:date', () => {
        test("It should add a customer to a queue and return 200", async () => {

            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();
            await expect(request(app).post(baseURL + "/").send({ serviceId: testId, date: testDate })).resolves.toBe(200);

            const response = await request(app)
                .patch(baseURL + `/${testId}/${testDate}`);

            expect(response.status).toBe(200);
            expect(controller.addCustomerToQueue).toHaveBeenCalledWith(testId, date);
            expect(response.body).toEqual(queue_plus);
        });

        test("It should return 422 if the serviceId is not a string", async () => {
            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();
            await expect(request(app).post(baseURL + "/").send({ serviceId: testId, date: testDate })).resolves.toBe(200);

            const response = await request(app)
                .patch(baseURL + `/` + 1 + `/${testDate}`);

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the date is not a string", async () => {
            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();
            await expect(request(app).post(baseURL + "/").send({ serviceId: testId, date: testDate })).resolves.toBe(200);

            const response = await request(app)
                .patch(baseURL + `/1/` + 1);

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the serviceId is empty", async () => {
            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();
            await expect(request(app).post(baseURL + "/").send({ serviceId: testId, date: testDate })).resolves.toBe(200);

            const response = await request(app)
                .patch(baseURL + `/ /${testDate}`);

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the date is empty", async () => {
            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();
            await expect(request(app).post(baseURL + "/").send({ serviceId: testId, date: testDate })).resolves.toBe(200);

            const response = await request(app)
                .patch(baseURL + `/${testId}/`);

            expect(response.status).toBe(422);
        });

        test("It should return 503 if there is an error", async () => {
            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();
            await expect(request(app).post(baseURL + "/").send({ serviceId: testId, date: testDate })).resolves.toBe(200);

            const response = await request(app)
                .patch(baseURL + `/${testId}/2020-10-10`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe("No queue found with specified serviceId for specified date");
        });
    });

    describe('DELETE /:serviceId/:date', () => {
        test("It should delete a queue and return 200", async () => {
            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();
            await expect(request(app).post(baseURL + "/").send({ serviceId: testId, date: testDate })).resolves.toBe(200);

            let response = await request(app)
                .get(baseURL + `/${testId}/${testDate}`);

            expect(response.status).toBe(200);
            expect(controller.getQueue).toHaveBeenCalledWith(testId, date);
            expect(response.body).toEqual(queue_input);

            await expect(request(app).delete(baseURL + `/${testId}/${testDate}`)).resolves.toBe(200);
            expect(controller.deleteQueue).toHaveBeenCalledWith(testId, date);

            response = await request(app)
                .get(baseURL + `/${testId}/${testDate}`);

            expect(response.status).toBe(503);
            expect(controller.getQueue).toHaveBeenCalledWith(testId, date);
            expect(response.body).toEqual("No queue found with specified id");
        });

        test("It should return 422 if the serviceId is not a string", async () => {
            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();
            await expect(request(app).post(baseURL + "/").send({ serviceId: testId, date: testDate })).resolves.toBe(200);

            const response = await request(app)
                .delete(baseURL + `/` + 1 + `/${testDate}`);

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the date is not a string", async () => {
            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();
            await expect(request(app).post(baseURL + "/").send({ serviceId: testId, date: testDate })).resolves.toBe(200);

            const response = await request(app)
                .delete(baseURL + `/1/` + 1);

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the serviceId is empty", async () => {
            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();
            await expect(request(app).post(baseURL + "/").send({ serviceId: testId, date: testDate })).resolves.toBe(200);

            const response = await request(app)
                .delete(baseURL + `/ /${testDate}`);

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the date is empty", async () => {
            await expect(serviceController.addService(testName, testTime)).resolves.toBeUndefined();
            await expect(request(app).post(baseURL + "/").send({ serviceId: testId, date: testDate })).resolves.toBe(200);

            const response = await request(app)
                .delete(baseURL + `/${testId}/`);

            expect(response.status).toBe(422);
        });

        test("It should return 503 if there is an error", async () => {
            jest.spyOn(controller, "deleteQueue").mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .delete(baseURL + `/${testId}/${testDate}`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('POST /:counterId', () => {
        const ticket_output = new Ticket(1, 1, "2024-10-15", 1);

        test("It should call the next ticket and return 200", async () => {

            await expect(counterController.addCounter("Counter1")).resolves.toBeUndefined();

            await expect(serviceController.addService(testName,testTime)).resolves.toBeUndefined();
            await expect(serviceController.addService("Service2",testTime)).resolves.toBeUndefined();

            await expect(request(app).post(baseURL + "/").send({ serviceId: testId, date: testDate })).resolves.toBe(200);
            await expect(request(app).post(baseURL + "/").send({ serviceId: testId2, date: testDate })).resolves.toBe(200);

            await expect(request(app).patch(baseURL + `/${testId}/${testDate}`)).resolves.toBe(200);

            const queue1 =  await request(app).get(baseURL + `/${testId}/${testDate}`);
            const queue2 =  await request(app).get(baseURL + `/${testId2}/${testDate}`);

    
            const queues = await dao.getQueuesForCounter(1);
            expect(queues).toStrictEqual([queue1.body,queue2.body]);
            await expect(controller.findLongestQueue(queues)).resolves.toStrictEqual(queue1);

            const nextTicket = new Ticket(10, queue1.body.serviceId, "2024-10-15",1);
            await expect(controller.selectNextTicket(queue1.body)).resolves.toStrictEqual(nextTicket);
       
            await expect(ticketDAO.issuedTicket(nextTicket.id,1)).resolves.toBeUndefined();

            await expect(dao.removeTicketFromQueue(queue1.body.serviceId)).resolves.toBeUndefined();

            const response = await request(app)
                .post(baseURL+`/${testId}`);

            expect(response.status).toBe(200);
            expect(controller.callNextTicket).toHaveBeenCalledWith(parseInt(testId));
            expect(response.body).toEqual(ticket_output);

        });

        test("It should return 422 if the counterId is invalid", async () => {
            const response = await request(app)
                .post(baseURL+`/invalid-id`);

            expect(response.status).toBe(422);
        });

        test("It should resolve with null if no queues available and return 200", async () => {
  
            await expect(counterController.addCounter("Counter1")).resolves.toBeUndefined();

            await expect(serviceController.addService(testName,testTime)).resolves.toBeUndefined();
            await expect(serviceController.addService("Service2",testTime)).resolves.toBeUndefined();

            const response = await request(app)
                .post(baseURL+`/${testId}`);

            expect(response.status).toBe(200);
            expect(controller.callNextTicket).toHaveBeenCalledWith(parseInt(testId));
            expect(response.body).toBeNull();
            
        });

        test("It should return 503 if there is an error", async () => {
            jest.spyOn(controller, "callNextTicket").mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .post(baseURL+`/${testId}`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('POST /reset', () => {
        test("It should reset the queues and return 200", async () => {

            const response = await request(app)
                .post(baseURL+`/reset`);

            expect(response.status).toBe(200);
        });

        test("It should return 503 if there is an error", async () => {
            jest.spyOn(controller, "resetQueues").mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .post(baseURL+`/reset`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

});