import { describe, afterEach, test, expect, jest } from "@jest/globals"
import counterDAO from "../../src/dao/counterDAO"
import counterController from "../../src/controllers/counterController"
import { Counter } from "../../src/components/counter";
import { Service } from "../../src/components/service";

jest.mock("../../src/dao/counterDAO.ts");

describe('counterController', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    const dao = counterDAO.prototype;
    const controller = new counterController();
    const mockCounter = new Counter(1, "Counter1");
    const mockCounters = [mockCounter,new Counter(2, "Counter2")];
    const mockError = new Error('Database error');
    const testId = 1;
    const testName = "CounterX";
    const mockServices = [new Service (1,"Service1"),new Service (2,"Service2")];

    describe('getCounter', () => {

        test("It should return the counter if it exists", async () => {

            jest.spyOn(dao, 'getCounter').mockResolvedValue(mockCounter);

            await expect(controller.getCounter(testId)).resolves.toEqual(mockCounter);
            expect(dao.getCounter).toHaveBeenCalledWith(testId);

        });

        test("It should return an error if the counter does not exist", async () => {

            jest.spyOn(dao, 'getCounter').mockRejectedValue("Counter not found.");

            await expect(controller.getCounter(5)).rejects.toEqual("Counter not found.");
            expect(dao.getCounter).toHaveBeenCalledWith(5);

        });

        test("It should reject with an error if there is a database error", async () => {

            jest.spyOn(dao, 'getCounter').mockRejectedValue(mockError);

            await expect(controller.getCounter(testId)).rejects.toThrow(mockError);
            expect(dao.getCounter).toHaveBeenCalledWith(testId);

        });

    });

    describe('getAllCounters', () => {
        test("It should return all the counters", async () => {

            jest.spyOn(dao, 'getAllCounters').mockResolvedValue(mockCounters);

            await expect(controller.getAllCounters()).resolves.toEqual(mockCounters);
            expect(dao.getAllCounters).toHaveBeenCalledWith();

        });

        test("It should reject with an error if there is a database error", async () => {

            jest.spyOn(dao, 'getAllCounters').mockRejectedValue(mockError);

            await expect(controller.getAllCounters()).rejects.toThrow(mockError);
            expect(dao.getAllCounters).toHaveBeenCalledWith();
        });
    });

    describe('deleteCounter', () => {
        test('It should successfully delete the counter', async () => {

            jest.spyOn(dao, 'deleteCounter').mockResolvedValue(undefined);

            await expect(controller.deleteCounter(testId)).resolves.toBeUndefined();
            expect(dao.deleteCounter).toHaveBeenCalledWith(testId);

        });

        test('It should reject when the counter is not found', async () => {
            jest.spyOn(dao, 'deleteCounter').mockRejectedValue("Counter not found.");

            await expect(controller.deleteCounter(testId)).rejects.toEqual("Counter not found.");
            expect(dao.deleteCounter).toHaveBeenCalledWith(testId);

        
        });

        test('It should reject with an error if the database operation fails', async () => {

            jest.spyOn(dao, 'deleteCounter').mockRejectedValue(mockError);

            await expect(controller.deleteCounter(testId)).rejects.toThrow(mockError);
            expect(dao.deleteCounter).toHaveBeenCalledWith(testId);
        
        });

    });

    describe('addCounter', () => {
        test('It should successfully add the counter', async () => {

            jest.spyOn(dao, 'addCounter').mockResolvedValue(undefined);

            await expect(controller.addCounter(testName)).resolves.toBeUndefined();
            expect(dao.addCounter).toHaveBeenCalledWith(testName);
        
        });

        test('It should reject when there is an error', async () => {

            jest.spyOn(dao, 'addCounter').mockRejectedValue("Insertion not completed correctly.");

            await expect(controller.addCounter(testName)).rejects.toEqual("Insertion not completed correctly.");
            expect(dao.addCounter).toHaveBeenCalledWith(testName);
        });

        test('It should reject with an error if the database operation fails', async () => {

            jest.spyOn(dao, 'addCounter').mockRejectedValue(mockError);

            await expect(controller.addCounter(testName)).rejects.toThrow(mockError);
            expect(dao.addCounter).toHaveBeenCalledWith(testName);
        
        });
    });

    describe('editCounter', () => {
        test('It should successfully rename the counter', async () => {

            jest.spyOn(dao, 'editCounter').mockResolvedValue(undefined);

            await expect(controller.editCounter(testId,testName)).resolves.toBeUndefined();
            expect(dao.editCounter).toHaveBeenCalledWith(testId,testName);

        });

        test('It should reject when the counter ID it is not in the database', async () => {

            jest.spyOn(dao, 'editCounter').mockRejectedValue("Update not completed correctly.");

            await expect(controller.editCounter(testId,testName)).rejects.toEqual("Update not completed correctly.");
            expect(dao.editCounter).toHaveBeenCalledWith(testId,testName);
        });

        test('It should reject with an error if the database operation fails', async () => {

            jest.spyOn(dao, 'editCounter').mockRejectedValue(mockError);

            await expect(controller.editCounter(testId,testName)).rejects.toThrow(mockError);
            expect(dao.editCounter).toHaveBeenCalledWith(testId,testName);

        });

    });

    describe('addCounterService', () => {
        test('It should successfully add a service to the counter', async () => {

            jest.spyOn(dao, 'addCounterService').mockResolvedValue(undefined);

            await expect(controller.addCounterService(testId,testId)).resolves.toBeUndefined();
            expect(dao.addCounterService).toHaveBeenCalledWith(testId,testId);

        });

        test('It should reject when there is an error', async () => {

            jest.spyOn(dao, 'addCounterService').mockRejectedValue("Insertion not completed correctly.");

            await expect(controller.addCounterService(testId,testId)).rejects.toEqual("Insertion not completed correctly.");
            expect(dao.addCounterService).toHaveBeenCalledWith(testId,testId);

        });
        
        test('It should reject with an error if the database operation fails', async () => {

            jest.spyOn(dao, 'addCounterService').mockRejectedValue(mockError);

            await expect(controller.addCounterService(testId,testId)).rejects.toThrow(mockError);
            expect(dao.addCounterService).toHaveBeenCalledWith(testId,testId);

        });

    });

    describe('deleteCounterService', () => {
        test('It should successfully delete a service from the counter', async () => {

            jest.spyOn(dao, 'deleteCounterService').mockResolvedValue(undefined);

            await expect(controller.deleteCounterService(testId,testId)).resolves.toBeUndefined();
            expect(dao.deleteCounterService).toHaveBeenCalledWith(testId,testId);

        });

        test('It should reject when the counter and/or the service are not in the database', async () => {

            jest.spyOn(dao, 'deleteCounterService').mockRejectedValue("Counter and/or service not found.");

            await expect(controller.deleteCounterService(testId,testId)).rejects.toEqual("Counter and/or service not found.");
            expect(dao.deleteCounterService).toHaveBeenCalledWith(testId,testId);

        });
        
        test('It should reject with an error if the database operation fails', async () => {

            jest.spyOn(dao, 'deleteCounterService').mockRejectedValue(mockError);

            await expect(controller.deleteCounterService(testId,testId)).rejects.toThrow(mockError);
            expect(dao.deleteCounterService).toHaveBeenCalledWith(testId,testId);

    });
});

    describe('viewAllServicesByCounterToday', () => {
        test('It should successfully return all service types that manage a counter based on the counter id and date (today)', async () => {

            jest.spyOn(dao, 'viewAllServicesByCounterToday').mockResolvedValue(mockServices);

            await expect(controller.viewAllServicesByCounterToday(testId)).resolves.toBe(mockServices);
            expect(dao.viewAllServicesByCounterToday).toHaveBeenCalledWith(testId);
        });

        test('It should return an empty array if no services found', async () => {

            jest.spyOn(dao, 'viewAllServicesByCounterToday').mockResolvedValue([]);

            await expect(controller.viewAllServicesByCounterToday(testId)).resolves.toEqual([]);
            expect(dao.viewAllServicesByCounterToday).toHaveBeenCalledWith(testId);
        });

        test("It should reject with an error if there is a database error", async () => {

            jest.spyOn(dao, 'viewAllServicesByCounterToday').mockRejectedValue(mockError);

            await expect(controller.viewAllServicesByCounterToday(testId)).rejects.toThrow(mockError);
            expect(dao.viewAllServicesByCounterToday).toHaveBeenCalledWith(testId);
        });
    });

});