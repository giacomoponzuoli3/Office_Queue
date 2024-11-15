import { describe, beforeEach, afterEach, test, expect, jest } from "@jest/globals";
import request from 'supertest';
import serviceController from "../../src/controllers/serviceController";
import ServiceDAO from "../../src/dao/serviceDAO";
import { Service } from "../../src/components/service";
import { app } from "../../index";

const baseURL = "/officequeue/services";

jest.mock("../../src/controllers/serviceController");

describe('ServiceRoutes', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    const dao = ServiceDAO.prototype;
    const controller = serviceController.prototype;
    const testName = "service X";
    const testId = 1;
    const testTime = 10;
    const newName = "Updated Service";
    const newServiceTime = 15;
    const mockService = new Service(testId, testName, testTime);
    const mockServices = [mockService, new Service(2)];

    describe('POST /', () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(dao, 'addService').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .post(baseURL + "/")
                .send({
                    name: testName,
                    serviceTime: testTime
                });

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });

        test('It should register a service and return 200 status', async () => {
            jest.spyOn(controller, "addService").mockResolvedValueOnce(undefined);

            const response = await request(app)
                .post(baseURL + "/")
                .send({
                    name: testName,
                    serviceTime: testTime
                });

            expect(response.status).toBe(200);
            expect(controller.addService).toHaveBeenCalledWith(testName, testTime);
        });

        test('It should return 422 status if the body is missing', async () => {
            const response = await request(app)
                .post(baseURL + "/")
                .send({});

            expect(response.status).toBe(422);
        });

        test('It should return 422 status if the service name is a string with length less than 3', async () => {
            const response = await request(app)
                .post(baseURL + "/")
                .send({
                    name: "ab",
                    serviceTime: testTime
                });

            expect(response.status).toBe(422);
        });

        test('It should return 422 status if the service time is not a number', async () => {
            const response = await request(app)
                .post(baseURL + "/")
                .send({
                    name: testName,
                    serviceTime: "not-a-number"
                });

            expect(response.status).toBe(422);
        });

    });

    describe('GET /:id', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        test('It should retrieve a specific service and return 200', async () => {
            jest.spyOn(controller, "getService").mockResolvedValueOnce(mockService);

            const response = await request(app)
                .get(baseURL + `/${testId}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockService);
        });

        test('It should return 422 if the service id is not numeric', async () => {
            jest.spyOn(controller, "getService").mockResolvedValueOnce(mockService);
            const response = await request(app)
                .get(baseURL + `/abc`);

            expect(response.status).toBe(422);
        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(dao, 'getService').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .get(baseURL + `/${testId}`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('GET /', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        test('It should retrieve all services and return 200', async () => {
            jest.spyOn(controller, "getServices").mockResolvedValueOnce(mockServices);

            const response = await request(app).get(baseURL);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockServices);
        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(dao, 'getServices').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app).get(baseURL);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('DELETE /:name', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        test('It should return 503 if there is an error', async () => {
            jest.spyOn(dao, 'deleteService').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .delete(`${baseURL}/${testName}`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
        test('It should delete a specific service and return 200', async () => {
            jest.spyOn(controller, "deleteService").mockResolvedValueOnce(undefined);

            const response = await request(app)
                .delete(`${baseURL}/${testName}`);

            expect(response.status).toBe(200);
            expect(controller.deleteService).toHaveBeenCalledWith(testName);
        });
    });

    describe('PATCH /:name', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        test('It should edit a service and return 200', async () => {
            jest.spyOn(controller, "editService").mockResolvedValueOnce(undefined);

            const response = await request(app)
                .patch(baseURL + `/${testName}`)
                .send({ newName, serviceTime: newServiceTime });

            expect(response.status).toBe(200);
            expect(controller.editService).toHaveBeenCalledWith(testName, newName, newServiceTime);
        });

        test('It should return 422 if newName is not provided', async () => {
            jest.spyOn(controller, "editService").mockResolvedValueOnce(undefined);

            const response = await request(app)
                .patch(baseURL + `/${testName}`)
                .send({ serviceTime: 15 });

            expect(response.status).toBe(422);
        });

        test('It should return 422 if the body is missing', async () => {
            jest.spyOn(controller, "editService").mockResolvedValueOnce(undefined);

            const response = await request(app)
                .patch(baseURL + `/${testName}`)
                .send({});

            expect(response.status).toBe(422);
        });

        test('It should return 422 if serviceTime is not a number', async () => {
            jest.spyOn(controller, "editService").mockResolvedValueOnce(undefined);

            const response = await request(app)
                .patch(baseURL + `/${testName}`)
                .send({ newName: "New Service", serviceTime: "not-a-number" });

            expect(response.status).toBe(422);
        });


        test('It should return 503 if there is an error', async () => {
            jest.spyOn(dao, 'editService').mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .patch(baseURL + `/${testName}`)
                .send({ newName, serviceTime: newServiceTime });

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('GET /waitingtime/:id', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test('It should return the waiting time for a service', async () => {
            const testId = "2";
            const expectedWaitingTime = 10;

            jest.spyOn(serviceController.prototype, "estimateServiceWaitingTime").mockResolvedValueOnce(expectedWaitingTime);

            const response = await request(app)
                .get(`${baseURL}/waitingtime/${testId}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ waitingTime: expectedWaitingTime });
            expect(serviceController.prototype.estimateServiceWaitingTime).toHaveBeenCalledWith(testId);
        });

        test('It should return 503 if there is an error', async () => {
            const testId = "4";

            jest.spyOn(serviceController.prototype, "estimateServiceWaitingTime").mockRejectedValueOnce(new Error("Database error"));

            const response = await request(app)
                .get(`${baseURL}/waitingtime/${testId}`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe("Internal Server Error");
        });

        test('It should return 422 if the service id is numeric', async () => {
            const num = 1; 
            const response = await request(app)
                .get(`${baseURL}/waitingtime/${Number(num)}`);
        
            expect(response.status).toBe(422);
            expect(response.body.error).toBe("Invalid service ID format.");
        });
        
    });
});