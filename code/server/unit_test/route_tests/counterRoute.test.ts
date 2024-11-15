import { describe, beforeEach, afterEach, test, expect, jest } from "@jest/globals";
import request from 'supertest';
import counterController from "../../src/controllers/counterController";
import CounterDAO from "../../src/dao/counterDAO";
import { Counter } from "../../src/components/counter";
import { Service } from "../../src/components/service";
import { app } from "../../index";

const baseURL = "/officequeue/counters";

jest.mock("../../src/controllers/counterController.ts");

describe('CounterRoutes', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    const controller = counterController.prototype;
    const dao = CounterDAO.prototype;
    const mockCounter = new Counter(1, "Counter1");
    const mockCounters = [mockCounter, new Counter(2, "Counter2")];
    const mockError = new Error('Internal Server Error');
    const testId = 1;
    const testName = "CounterX";
    const mockServices = [new Service(1, "Service1"), new Service(2, "Service2")];

    describe('POST /', () => {
        test('It should register a counter and return 200 status', async () => {
            jest.spyOn(controller, "addCounter").mockResolvedValueOnce(undefined);

            const response = await request(app)
                .post(baseURL + "/")
                .send({ name: testName });

            expect(response.status).toBe(200);
            expect(controller.addCounter).toHaveBeenCalledWith(testName);
        });

        test('It should return 422 status if the body is missing', async () => {
            const response = await request(app)
                .post(baseURL + "/")
                .send({});

            expect(response.status).toBe(422);
        });

        test('It should return 422 status if the name is an empty string', async () => {
            const response = await request(app)
                .post(baseURL + "/")
                .send({ name: "" });

            expect(response.status).toBe(422);
        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(dao, 'addCounter').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .post(baseURL + `/`)
                .send({ name: testName });

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('GET /:id', () => {
        test('It should retrieve a counter and return 200 status', async () => {
            jest.spyOn(controller, "getCounter").mockResolvedValueOnce(mockCounter);

            const response = await request(app).get(baseURL + `/${testId}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCounter);
            expect(controller.getCounter).toHaveBeenCalledWith(`${testId}`);
        });

        test('It should return 422 status if the param is not an integer', async () => {
            const response = await request(app).get(baseURL + `/abc`);

            expect(response.status).toBe(422);
        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(dao, 'getCounter').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app).get(baseURL + `/${testId}`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('GET /', () => {
        test('It should retrieve all counters and return 200 status', async () => {
            jest.spyOn(controller, "getAllCounters").mockResolvedValueOnce(mockCounters);

            const response = await request(app).get(baseURL);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCounters);
        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(dao, 'getAllCounters').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app).get(baseURL);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('POST /:id', () => {
        test('It should update a counter and return 200 status', async () => {
            jest.spyOn(controller, "editCounter").mockResolvedValueOnce(undefined);

            const response = await request(app)
                .post(baseURL + `/${testId}`)
                .send({ name: testName });

            expect(response.status).toBe(200);

        });

        test('It should return 422 status if the param is not an integer', async () => {
            const response = await request(app)
                .post(baseURL + `/abc`)
                .send({ name: testName });

            expect(response.status).toBe(422);
        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(dao, 'editCounter').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .post(baseURL + `/${testId}`)
                .send({ name: testName });

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('DELETE /:id', () => {
        test('It should delete a counter and return 200 status', async () => {
            jest.spyOn(controller, "deleteCounter").mockResolvedValueOnce(undefined);

            const response = await request(app).delete(baseURL + `/${testId}`);

            expect(response.status).toBe(200);
            expect(controller.deleteCounter).toHaveBeenCalledWith(`${testId}`);
        });

        test('It should return 422 status if the param is not an integer', async () => {
            const response = await request(app).delete(baseURL + `/abc`);

            expect(response.status).toBe(422);
        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(dao, 'deleteCounter').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app).delete(baseURL + `/${testId}`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('POST /:counterid/services/:serviceid', () => {
        test('It should return 503 if there is an error', async () => {
            jest.spyOn(dao, 'addCounterService').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .post(baseURL + `/${testId}/services/${testId}`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });

        test('It should add a service to the counter and return 200 status', async () => {
            jest.spyOn(controller, "addCounterService").mockResolvedValueOnce(undefined);

            const response = await request(app)
                .post(baseURL + `/${testId}/services/${testId}`);

            expect(response.status).toBe(200);
            expect(controller.addCounterService).toHaveBeenCalledWith(`${testId}`, `${testId}`);
        });

        test('It should add return 422 status if counterid is not an integer', async () => {
            jest.spyOn(controller, "addCounterService").mockResolvedValueOnce(undefined);

            const response = await request(app)
                .post(baseURL + `/abc/services/${testId}`);

            expect(response.status).toBe(422);
        });

        test('It should add return 422 status if serverid is not an integer', async () => {
            jest.spyOn(controller, "addCounterService").mockResolvedValueOnce(undefined);

            const response = await request(app)
                .post(baseURL + `/${testId}/services/abc`);

            expect(response.status).toBe(422);
        });
    });

    describe('DELETE /:counterid/services/:serviceid', () => {
        beforeEach(() => {
            jest.clearAllMocks(); 
        });
    
        test('It should return 503 if there is an error', async () => {
            jest.spyOn(dao, 'deleteCounterService').mockRejectedValueOnce(new Error('Internal Server Error'));
    
            const response = await request(app)
                .delete(baseURL + `/${testId}/services/${testId}`); 
    
            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    
        test('It should delete a service from the counter and return 200 status', async () => {
            jest.spyOn(controller, "deleteCounterService").mockResolvedValueOnce(undefined); 
    
            const response = await request(app)
                .delete(baseURL + `/${testId}/services/${testId}`); 
    
            expect(response.status).toBe(200);
            expect(controller.deleteCounterService).toHaveBeenCalledWith(`${testId}`, `${testId}`);
        });

        
    });

    describe('GET /:counterid/services', () => {
        test('It should return 503 if there is an error', async () => {
            jest.spyOn(dao, 'viewAllServicesByCounterToday').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app).get(baseURL + `/${testId}/services`)

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });


        test('It should view all services by counter and return 200 status', async () => {
            jest.spyOn(controller, "viewAllServicesByCounterToday").mockResolvedValueOnce(mockServices);

            const response = await request(app).get(baseURL + `/${testId}/services`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockServices);
        });


        test('It should add return 422 status if counterid is not an integer', async () => {
            jest.spyOn(controller, "viewAllServicesByCounterToday").mockResolvedValueOnce(mockServices);

            const response = await request(app).get(baseURL + `/abc/services`);

            expect(response.status).toBe(422);
        });
    });

});

