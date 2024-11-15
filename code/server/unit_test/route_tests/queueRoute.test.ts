import { test, expect, jest, afterEach, beforeAll, describe } from "@jest/globals";
import request from 'supertest';
import QueueController from "../../src/controllers/queueController";
import QueueRoutes from "../../src/routers/queueRoutes";
import { Queue } from "../../src/components/queue";
import { Ticket } from "../../src/components/ticket";
import { app } from "../../index";

const baseURL = "/officequeue/queues";

jest.mock("../../src/controllers/queueController.ts");

const testDate = "2024-10-14";
const testId = "1";
const queue_input = new Queue(3, new Date(), 3);
const controller = QueueController.prototype;

describe('QueueRoutes', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /', () => {
        test("It should add a queue and return 200", async () => {
            jest.spyOn(controller, "addQueue").mockResolvedValueOnce(undefined);

            const response = await request(app)
                .post(baseURL + "/")
                .send({ serviceId: testId, date: testDate });

            expect(response.status).toBe(200);
            expect(controller.addQueue).toHaveBeenCalledWith(testId, new Date(testDate));
        });

        test("It should return 422 if the serviceId is not a string", async () => {
            const response = await request(app)
                .post(baseURL + "/")
                .send({ serviceId: 1, date: testDate });

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the date is not a string", async () => {
            const response = await request(app)
                .post(baseURL + "/")
                .send({ serviceId: testId, date: 1 });

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the serviceId is empty", async () => {
            const response = await request(app)
                .post(baseURL + "/")
                .send({ serviceId: "", date: testDate });

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the date is empty", async () => {
            const response = await request(app)
                .post(baseURL + "/")
                .send({ serviceId: testId, date: "" });

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the body is missing", async () => {
            const response = await request(app)
                .post(baseURL + "/")
                .send({});

            expect(response.status).toBe(422);
        });

        test('It should return 503 if there is an error', async () => {
            jest.spyOn(controller, "addQueue").mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .post(baseURL + "/")
                .send({ serviceId: testId, date: testDate });

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('GET /:serviceId/:date', () => {
        test('It should retrieve a queue and return 200', async () => {
            jest.spyOn(controller, "getQueue").mockResolvedValueOnce(queue_input);

            const response = await request(app)
                .get(baseURL + `/${testId}/${testDate}`);

            expect(response.status).toBe(200);
            expect(controller.getQueue).toHaveBeenCalledWith(testId, new Date(testDate));
            expect(response.body).toEqual(queue_input);
        });

        test("It should return 422 if the serviceId is not a string", async () => {
            const response = await request(app)
                .get(baseURL + `/`+ 1 +`/${testDate}`);

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the date is not a string", async () => {
            const response = await request(app)
                .get(baseURL + `/1/`+1);

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the serviceId is empty", async () => {
            const response = await request(app)
                .get(baseURL + `/ /${testDate}`);

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the date is empty", async () => {
            const response = await request(app)
                .get(baseURL + `/${testId}/`);
                
            expect(response.status).toBe(422);
        });

        test("It should return 503 if there is an error", async () => {
            jest.spyOn(controller, "getQueue").mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .get(`${baseURL}/${testId}/${testDate}`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('PATCH /:serviceId/:date', () => {
        test("It should add a customer to a queue and return 200", async () => {
            jest.spyOn(controller, "addCustomerToQueue").mockResolvedValueOnce(queue_input);

            const response = await request(app)
                .patch(baseURL+`/${testId}/${testDate}`);

            expect(response.status).toBe(200);
            expect(controller.addCustomerToQueue).toHaveBeenCalledWith(testId, new Date(testDate));
            expect(response.body).toEqual(queue_input);
        });

        test("It should return 422 if the serviceId is not a string", async () => {
            const response = await request(app)
                .patch(baseURL + `/`+ 1 +`/${testDate}`);

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the date is not a string", async () => {
            const response = await request(app)
            .patch(baseURL + `/1/`+1);

        expect(response.status).toBe(422);
        });

        test("It should return 422 if the serviceId is empty", async () => {
            const response = await request(app)
            .patch(baseURL + `/ /${testDate}`);

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the date is empty", async () => {
            const response = await request(app)
                .patch(baseURL + `/${testId}/`);
                
            expect(response.status).toBe(422);
        });

        test("It should return 503 if there is an error", async () => {
            jest.spyOn(controller, "addCustomerToQueue").mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .patch(baseURL+`/${testId}/${testDate}`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('DELETE /:serviceId/:date', () => {
        test("It should delete a queue and return 200", async () => {
            jest.spyOn(controller, "deleteQueue").mockResolvedValueOnce(undefined);

            const response = await request(app)
                .delete(baseURL+`/${testId}/${testDate}`);

            expect(response.status).toBe(200);
            expect(controller.deleteQueue).toHaveBeenCalledWith(testId, new Date(testDate));
        });

        test("It should return 422 if the serviceId is not a string", async () => {
            const response = await request(app)
                .delete(baseURL + `/`+ 1 +`/${testDate}`);

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the date is not a string", async () => {
            const response = await request(app)
                .delete(baseURL + `/1/`+1);

        expect(response.status).toBe(422);
        });

        test("It should return 422 if the serviceId is empty", async () => {
            const response = await request(app)
                .delete(baseURL + `/ /${testDate}`);

            expect(response.status).toBe(422);
        });

        test("It should return 422 if the date is empty", async () => {
            const response = await request(app)
                .delete(baseURL + `/${testId}/`);
                
            expect(response.status).toBe(422);
        });

        test("It should return 503 if there is an error", async () => {
            jest.spyOn(controller, "deleteQueue").mockRejectedValueOnce(new Error('Internal Server Error'));

            const response = await request(app)
                .delete(baseURL+`/${testId}/${testDate}`);

            expect(response.status).toBe(503);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });


    describe('POST /:counterId', () => {
        const ticket_output = new Ticket(1, 1, 1, 3, new Date(), true);

        test("It should call the next ticket and return 200", async () => {
            jest.spyOn(controller, "callNextTicket").mockResolvedValueOnce(ticket_output);

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
            jest.spyOn(controller, "resetQueues").mockResolvedValueOnce(undefined);

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
