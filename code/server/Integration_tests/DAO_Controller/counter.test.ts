import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach, jest } from "@jest/globals"
import counterDAO from "../../src/dao/counterDAO"
import counterController from "../../src/controllers/counterController"
import { Counter } from "../../src/components/counter";
import { Service } from "../../src/components/service";
import db from "../../src/db/db";
import { Database } from "sqlite3";
import serviceController from "../../src/controllers/serviceController";
import { cleanup } from "../../src/db/cleanup";
import { setup} from "../../src/db/setup";

let controller: counterController;
let ServiceController: serviceController;
let dao: counterDAO;

describe('counterController/counterDAO Integration tests', () => {

    const testCounter = new Counter(1, "Counter1");
    const renameCounter = new Counter(1, "CounterX");
    const testCounters = [testCounter, new Counter(2, "Counter2")];
    const testId = 1;
    const testName = "Counter1";
    const testService = new Service (testId,"Service1",2);

    beforeAll(async () => {
        await setup();
        // Initialize DAO and controller
        controller = new counterController();
        dao = new counterDAO();
        ServiceController = new serviceController();

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

    beforeEach(async () => {
        await cleanup();
        jest.clearAllMocks(); // Clear mocks after each test
    });

    describe('getCounter', () => {

        test("It should return the counter if it exists", async () => {

            await expect(controller.addCounter(testName)).resolves.toBeUndefined();

            await expect(controller.getCounter(testId)).resolves.toStrictEqual(testCounter);

        });

        test("It should return an error if the counter does not exist", async () => {

            await expect(controller.addCounter(testName)).resolves.toBeUndefined();

            await expect(controller.getCounter(5)).rejects.toEqual("Counter not found.");

        });

        test("It should reject with an error if there is a database error", async () => {

            const dbGetSpy = jest.spyOn(db, 'get').mockImplementation(function (sql, params, callback) {
                callback(new Error('Database error'), null);
                return {} as Database;
            });

            await expect(controller.getCounter(testId)).rejects.toThrow("Database error");

            dbGetSpy.mockRestore();

        });

    });

    describe('getAllCounters', () => {

        test("It should return the counter if it exists", async () => {

            await expect(controller.addCounter(testName)).resolves.toBeUndefined();
            await expect(controller.addCounter("Counter2")).resolves.toBeUndefined();

            await expect(controller.getAllCounters()).resolves.toStrictEqual(testCounters);

        });

        test("It should return an empty array if there are no counters", async () => {

            await expect(controller.getAllCounters()).resolves.toStrictEqual([]);

        });

        test("It should reject with an error if there is a database error", async () => {

            const dbAllSpy = jest.spyOn(db, 'all').mockImplementation(function (sql, params, callback) {
                callback(new Error('Database error'), null);
                return {} as Database;
            });

            await expect(controller.getAllCounters()).rejects.toThrow("Database error");

            dbAllSpy.mockRestore();

        });

    });

    describe('addCounter', () => {

        test("It should add a counter in the database", async () => {

            await expect(controller.addCounter(testName)).resolves.toBeUndefined();

            await expect(controller.getCounter(testId)).resolves.toStrictEqual(testCounter);

        });

        test("It should reject when insertion is not completed correctly (lastID = 0)", async () => {

            const dbRunSpy = jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback.bind({ lastID: 0 })(null);
                return {} as Database;
            });

            await expect(controller.addCounter(testName)).rejects.toEqual("Insertion not completed correctly.");

            dbRunSpy.mockRestore();
        });

        test("It should reject with an error if there is a database error", async () => {

            const dbRunSpy = jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback(new Error('Database error'), null);
                return {} as Database;
            });

            await expect(controller.addCounter(testName)).rejects.toThrow("Database error");

            dbRunSpy.mockRestore();

        });

    });

    describe('deleteCounter', () => {

        test("It should delete a counter from the database", async () => {

            await expect(controller.addCounter(testName)).resolves.toBeUndefined();

            await expect(controller.getCounter(testId)).resolves.toStrictEqual(testCounter);

            await expect(controller.deleteCounter(testId)).resolves.toBeUndefined();

            await expect(controller.getCounter(testId)).rejects.toEqual("Counter not found.");

        });

        test("It should reject when the counter is not found", async () => {

            await expect(controller.deleteCounter(testId)).rejects.toEqual("Counter not found.");

        });

        test("It should reject with an error if there is a database error", async () => {

            const dbRunSpy = jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback(new Error('Database error'), null);
                return {} as Database;
            });

            await expect(controller.deleteCounter(testId)).rejects.toThrow("Database error");

            dbRunSpy.mockRestore();

        });

    });

    describe('editCounter', () => {
        test('It should successfully rename the counter', async () => {

            await expect(controller.addCounter(testName)).resolves.toBeUndefined();

            await expect(controller.getCounter(testId)).resolves.toStrictEqual(testCounter);

            await expect(controller.editCounter(testId, "CounterX")).resolves.toBeUndefined();

            await expect(controller.getCounter(testId)).resolves.toStrictEqual(renameCounter);


        });

        test('It should reject when the counter ID it is not in the database', async () => {

            await expect(controller.editCounter(testId, "CounterX")).rejects.toEqual("Update not completed correctly.");

        });

        test('It should reject with an error if the database operation fails', async () => {

            const dbRunSpy = jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback(new Error('Database error'), null);
                return {} as Database;
            });

            await expect(controller.editCounter(testId, "CounterX")).rejects.toThrow("Database error");

            dbRunSpy.mockRestore();

        });

    });

    describe('addCounterService', () => {
        test('It should successfully add a service to the counter', async () => {

            await expect(controller.addCounter(testName)).resolves.toBeUndefined();

            await expect(controller.getCounter(testId)).resolves.toStrictEqual(testCounter);

            await expect(ServiceController.addService("Service1", 2)).resolves.toBeUndefined();

            await expect(controller.addCounterService(testId, testId)).resolves.toBeUndefined();

            await expect(controller.viewAllServicesByCounterToday(testId)).resolves.toStrictEqual([testService]);

        });

        test('It should reject when there is an error', async () => {

            const dbRunSpy = jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback.bind({ lastID: 0 })(null);
                return {} as Database;
            });

            await expect(controller.addCounterService(testId, testId)).rejects.toEqual("Insertion not completed correctly.");

            dbRunSpy.mockRestore();

        });

        test('It should reject with an error if the database operation fails', async () => {

            const dbRunSpy = jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback(new Error('Database error'), null);
                return {} as Database;
            });

            await expect(controller.addCounterService(testId, testId)).rejects.toThrow("Database error");

            dbRunSpy.mockRestore();

        });

    });

    describe('deletCounterService', () => {
        test('It should successfully add a service to the counter', async () => {

            await expect(controller.addCounter(testName)).resolves.toBeUndefined();

            await expect(controller.getCounter(testId)).resolves.toStrictEqual(testCounter);

            await expect(ServiceController.addService("Service1", 2)).resolves.toBeUndefined();

            await expect(controller.addCounterService(testId, testId)).resolves.toBeUndefined();

            await expect(controller.viewAllServicesByCounterToday(testId)).resolves.toStrictEqual([testService]);

            await expect(controller.deleteCounterService(testId, testId)).resolves.toBeUndefined();

            await expect(controller.viewAllServicesByCounterToday(testId)).resolves.toStrictEqual([]);

        });

        test('It should reject when there is an error', async () => {

            const dbRunSpy = jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback.bind({ changes: 0 })(null);
                return {} as Database;
            });

            await expect(controller.deleteCounterService(testId, testId)).rejects.toEqual("Counter and/or service not found.");

            dbRunSpy.mockRestore();

        });

        test('It should reject with an error if the database operation fails', async () => {

            const dbRunSpy = jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback(new Error('Database error'), null);
                return {} as Database;
            });

            await expect(controller.deleteCounterService(testId, testId)).rejects.toThrow("Database error");

            dbRunSpy.mockRestore();

        });

    });

    describe('viewAllServicesByCounterToday', () => {
        test('It should successfully return all service types that manage a counter based on the counter id and date (today)', async () => {

            await expect(controller.addCounter(testName)).resolves.toBeUndefined();

            await expect(controller.getCounter(testId)).resolves.toStrictEqual(testCounter);

            await expect(ServiceController.addService("Service1", 2)).resolves.toBeUndefined();

            await expect(controller.addCounterService(testId, testId)).resolves.toBeUndefined();

            await expect(controller.viewAllServicesByCounterToday(testId)).resolves.toStrictEqual([testService]);
        });

        test('It should return an empty array if no services found', async () => {

            await expect(controller.viewAllServicesByCounterToday(testId)).resolves.toStrictEqual([]);
        });

        test("It should reject with an error if there is a database error", async () => {

            const dbAllSpy = jest.spyOn(db, 'all').mockImplementation(function (sql, params, callback) {
                callback(new Error('Database error'), null);
                return {} as Database;
            });

            await expect(controller.viewAllServicesByCounterToday(testId)).rejects.toThrow("Database error");

            dbAllSpy.mockRestore();
        });
    });

});