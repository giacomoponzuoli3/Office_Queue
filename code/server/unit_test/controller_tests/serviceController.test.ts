import { describe, afterEach, test, expect, beforeAll, afterAll, jest } from "@jest/globals"
import serviceDAO from "../../src/dao/serviceDAO"
import serviceController from "../../src/controllers/serviceController"
import { Service } from "../../src/components/service";

jest.mock("../../src/dao/serviceDAO.ts");

describe('serviceController', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    const dao = serviceDAO.prototype;
    const controller = new serviceController();
    const testName = "service X";
    const testId = 1;
    const testTime = 10;
    const mockService = new Service (testId,testName,testTime);
    const mockServices = [new Service (testId,testName,testTime), new Service (2)];
    const mockError = new Error('Database error');

    describe('addService', () => {
        
        test("It should sucessfully add a new service", async () => {

            jest.spyOn(dao, 'addService').mockResolvedValue(undefined);

            await expect(controller.addService(testName,testTime)).resolves.toBeUndefined();
            expect(dao.addService).toHaveBeenCalledWith(testName,testTime);

        });

        test("It should throw an error if there is an error during insertion", async () => {

            jest.spyOn(dao, 'addService').mockRejectedValue(`Error inserting service: ${mockError.message}`);

            await expect(controller.addService(testName,testTime)).rejects.toEqual(`Error inserting service: ${mockError.message}`);
            expect(dao.addService).toHaveBeenCalledWith(testName,testTime);

        });

    });

    describe('getService', () => {

        test("It should sucessfully return the service if it exists", async () => {

            jest.spyOn(dao, 'getService').mockResolvedValue(mockService);

            await expect(controller.getService(testId)).resolves.toEqual(mockService);
            expect(dao.getService).toHaveBeenCalledWith(testId);


        });

        test("It should throw an error if the service is not in the database", async () => {

            jest.spyOn(dao, 'getService').mockRejectedValue(`Service with ID ${testId} not found`);

            await expect(controller.getService(testId)).rejects.toEqual(`Service with ID ${testId} not found`);
            expect(dao.getService).toHaveBeenCalledWith(testId);

        });

        test("It should throw an error if there is a database error", async () => {

            jest.spyOn(dao, 'getService').mockRejectedValue(`Error retrieving service: ${mockError.message}`);

            await expect(controller.getService(testId)).rejects.toEqual(`Error retrieving service: ${mockError.message}`);
            expect(dao.getService).toHaveBeenCalledWith(testId);

        });


    });

    describe('getServices', () => {

        test("It should sucessfully return all the services", async () => {
            
            jest.spyOn(dao, 'getServices').mockResolvedValue(mockServices);

            await expect(controller.getServices()).resolves.toEqual(mockServices);
            expect(dao.getServices).toHaveBeenCalledWith();

        });

        test("It should return an empty array if there are no services", async () => {
           
            jest.spyOn(dao, 'getServices').mockResolvedValue([]);

            await expect(controller.getServices()).resolves.toEqual([]);
            expect(dao.getServices).toHaveBeenCalledWith();

        });

        test("It should throw an error if there is a database error", async () => {
    
            jest.spyOn(dao, 'getServices').mockRejectedValue(`Error retrieving services: ${mockError.message}`);

            await expect(controller.getServices()).rejects.toEqual(`Error retrieving services: ${mockError.message}`);
            expect(dao.getServices).toHaveBeenCalledWith();

        });

    });

    describe('deleteService', () => {
        test("It should sucessfully delete a service", async () => {
            
            jest.spyOn(dao, 'deleteService').mockResolvedValue(undefined);

            await expect(controller.deleteService(testName)).resolves.toBeUndefined();
            expect(dao.deleteService).toHaveBeenCalledWith(testName);

        });

        test("It should throw an error if there is a database error", async () => {
           
            jest.spyOn(dao, 'deleteService').mockRejectedValue(`Error deliting service: ${mockError.message}`);

            await expect(controller.deleteService(testName)).rejects.toEqual(`Error deliting service: ${mockError.message}`);
            expect(dao.deleteService).toHaveBeenCalledWith(testName);

        });

    });

    describe('editService', () => {

        test("It should sucessfully edit a service", async () => {
           
            jest.spyOn(dao, 'editService').mockResolvedValue(undefined);

            await expect(controller.editService(testName,"",testTime)).resolves.toBeUndefined();
            expect(dao.editService).toHaveBeenCalledWith(testName,"",testTime);

        });

        test("It should throw an error if there is a database error", async () => {

            jest.spyOn(dao, 'editService').mockRejectedValue(`Error editing service: ${mockError.message}`);

            await expect(controller.editService(testName,"",testTime)).rejects.toEqual(`Error editing service: ${mockError.message}`);
            expect(dao.editService).toHaveBeenCalledWith(testName,"",testTime);
        });
    });

    describe(("estimateServiceWaitingTime"), () => {

        test("It should resolve with return of a service time", async () => {

            const service = new Service(1, "test", 5);

            jest.spyOn(dao, "estimateServiceWaitingTime").mockResolvedValue(service.serviceTime);

            const result = await controller.estimateServiceWaitingTime(1);
            expect(dao.estimateServiceWaitingTime).toHaveBeenCalledTimes(1);
            expect(dao.estimateServiceWaitingTime).toHaveBeenCalledWith(1);
            expect(result).toEqual(5);
        });

        test("It should reject with an error", async () => {

            const service = new Service(1, "test", 5);

            jest.spyOn(dao, "estimateServiceWaitingTime").mockRejectedValue("Error during estimate service time");

            await expect(controller.estimateServiceWaitingTime(1)).rejects.toEqual("Error during estimate service time");
            expect(dao.estimateServiceWaitingTime).toHaveBeenCalledTimes(1);
            expect(dao.estimateServiceWaitingTime).toHaveBeenCalledWith(1);
        });
    });

});