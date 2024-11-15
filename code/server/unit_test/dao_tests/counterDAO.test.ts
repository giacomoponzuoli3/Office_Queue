import { describe, afterEach, test, expect, jest } from "@jest/globals"
import counterDAO from "../../src/dao/counterDAO"
import db from "../../src/db/db"
import { Counter } from "../../src/components/counter";
import { Service } from "../../src/components/service";
import { Database } from "sqlite3";

jest.mock("../../src/db/db.ts")

const getFormattedDate = (): string => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // I mesi partono da 0, quindi aggiungi 1
    const year = today.getFullYear();
  
    return `${day}-${month}-${year}`;
};

describe('countertDAO', () => {

    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test
    });

    const dao = new counterDAO();
    const mockCounter = new Counter(1, "Counter1");
    const mockCounters = [mockCounter,new Counter(2, "Counter2")];
    const mockError = new Error('Database error');
    const testId = 1;
    const testName = "CounterX";
    const date = getFormattedDate();
    const mockServices = [new Service (1,"Service1"),new Service (2,"Service2")];

    describe('getCounter', () => {
        test("It should return the counter if it exists", async () => {
            
            jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
                callback(null, mockCounter);
                return {} as Database;
            });

            const response = await dao.getCounter(testId);

            expect(db.get).toHaveBeenCalledWith(
                "SELECT * FROM counter WHERE id = ?",
                [testId],
                expect.any(Function)
            );
            expect(response).toEqual(mockCounter);
        });

        test("It should reject with an error if the counter is not found", async () => {

            jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
                callback(null, undefined);
                return {} as Database;
            });
            
            await expect(dao.getCounter(testId)).rejects.toEqual("Counter not found.");

        });

        test("It should reject with an error if there is a database error", async () => {

            jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
                callback(mockError, testId);
                return {} as Database;
            });
            
            await expect(dao.getCounter(testId)).rejects.toThrow('Database error');

        });
    });

    describe('getAllCounters', () => {
        test("It should return all the counters", async () => {

            jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
                callback(null, mockCounters);
                return {} as Database;
            });

            const response = await dao.getAllCounters();

            expect(db.all).toHaveBeenCalledWith(
                "SELECT * FROM counter",
                [],
                expect.any(Function)
            );
            expect(response).toEqual(mockCounters);
        });

        test("It should reject with an error if there is a database error", async () => {

            jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
                callback(mockError, null);
                return {} as Database;
            });
            
            await expect(dao.getAllCounters()).rejects.toThrow('Database error');

            expect(db.all).toHaveBeenCalledWith(
                "SELECT * FROM counter",
                [],
                expect.any(Function)
            );
        });
    });

    describe('deleteCounter', () => {
        test('It should successfully delete the counter', async () => {

            jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback.bind({ changes: 1 })(null); 
                return {} as Database; 
            });

            await expect(dao.deleteCounter(testId)).resolves.toBeUndefined();
    
            expect(db.run).toHaveBeenCalledWith(
                "DELETE FROM counter WHERE id = ?",
                [testId],
                expect.any(Function)
            );
        
        });

        test('It should reject when the counter is not found', async () => {
            jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback.bind({ changes: 0 })(null); 
                return {} as Database; 
            });

            await expect(dao.deleteCounter(testId)).rejects.toEqual("Counter not found.");
    
            expect(db.run).toHaveBeenCalledWith(
                "DELETE FROM counter WHERE id = ?",
                [testId],
                expect.any(Function)
            );
        
        });

        test('It should reject with an error if the database operation fails', async () => {

            jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback.bind({ changes: 1 })(mockError); 
                return {} as Database; 
            });

            await expect(dao.deleteCounter(testId)).rejects.toThrow('Database error');
    
            expect(db.run).toHaveBeenCalledWith(
                "DELETE FROM counter WHERE id = ?",
                [testId],
                expect.any(Function)
            );
        
        });

    });

    describe('addCounter', () => {
        test('It should successfully add the counter', async () => {

            jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback.bind({  lastID: 1 })(null); 
                return {} as Database; 
            });

            await expect(dao.addCounter(testName)).resolves.toBeUndefined();
    
            expect(db.run).toHaveBeenCalledWith(
                "INSERT INTO counter(name) VALUES(?)",
                [testName],
                expect.any(Function)
            );
        
        });

        test('It should reject when there is an error', async () => {
            jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback.bind({ lastID: 0 })(null); 
                return {} as Database; 
            });

            await expect(dao.addCounter(testName)).rejects.toEqual("Insertion not completed correctly.");
    
            expect(db.run).toHaveBeenCalledWith(
                "INSERT INTO counter(name) VALUES(?)",
                [testName],
                expect.any(Function)
            );
        
        });

        test('It should reject with an error if the database operation fails', async () => {

            jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback.bind({ lastID: 1 })(mockError); 
                return {} as Database; 
            });

            await expect(dao.addCounter(testName)).rejects.toThrow('Database error');
    
            expect(db.run).toHaveBeenCalledWith(
                "INSERT INTO counter(name) VALUES(?)",
                [testName],
                expect.any(Function)
            );
        
        });
    });

    describe('editCounter', () => {
        test('It should successfully rename the counter', async () => {

            jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback.bind({ changes: 1 })(null); 
                return {} as Database; 
            });

            await expect(dao.editCounter(testId,testName)).resolves.toBeUndefined();
    
            expect(db.run).toHaveBeenCalledWith(
                "UPDATE counter SET name = ? WHERE id = ?",
                [testName,testId],
                expect.any(Function)
            );

        });

        test('It should reject when the counter ID it is not in the database', async () => {

            jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback.bind({ changes: 0 })(null); 
                return {} as Database; 
            });

            await expect(dao.editCounter(testId,testName)).rejects.toEqual("Update not completed correctly.");
    
            expect(db.run).toHaveBeenCalledWith(
                "UPDATE counter SET name = ? WHERE id = ?",
                [testName,testId],
                expect.any(Function)
            );

        });

        test('It should reject with an error if the database operation fails', async () => {

            jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback.bind({ changes: 1 })(mockError); 
                return {} as Database; 
            });

            await expect(dao.editCounter(testId,testName)).rejects.toThrow('Database error');
    
            expect(db.run).toHaveBeenCalledWith(
                "UPDATE counter SET name = ? WHERE id = ?",
                [testName,testId],
                expect.any(Function)
            );

        });

    });

    describe('addCounterService', () => {
        test('It should successfully add a service to the counter', async () => {

            jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback.bind({ lastID: 1 })(null); 
                return {} as Database; 
            });

            await expect(dao.addCounterService(testId,testId)).resolves.toBeUndefined();
    
            expect(db.run).toHaveBeenCalledWith(
                "INSERT INTO counter_service(counterId, serviceId, date) VALUES(?, ?, ?)",
                [testId,testId,date],
                expect.any(Function)
            );

        });

        test('It should reject when there is an error', async () => {

            jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback.bind({ lastID: 0 })(null); 
                return {} as Database; 
            });
            
            await expect(dao.addCounterService(testId,testId)).rejects.toEqual("Insertion not completed correctly.");
    
            expect(db.run).toHaveBeenCalledWith(
                "INSERT INTO counter_service(counterId, serviceId, date) VALUES(?, ?, ?)",
                [testId,testId,date],
                expect.any(Function)
            );

        });
        
        test('It should reject with an error if the database operation fails', async () => {

            jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback.bind({ lastID: 1 })(mockError); 
                return {} as Database; 
            });

            await expect(dao.addCounterService(testId,testId)).rejects.toThrow('Database error');
    
            expect(db.run).toHaveBeenCalledWith(
                "INSERT INTO counter_service(counterId, serviceId, date) VALUES(?, ?, ?)",
                [testId,testId,date],
                expect.any(Function)
            );

        });

    });

    describe('deleteCounterService', () => {
        test('It should successfully delete a service from the counter', async () => {

            jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback.bind({ changes: 1 })(null); 
                return {} as Database; 
            });

            await expect(dao.deleteCounterService(testId,testId)).resolves.toBeUndefined();
    
            expect(db.run).toHaveBeenCalledWith(
                `DELETE FROM counter_service 
                        WHERE counterId = ? AND serviceId = ? AND date = ?`,
                [testId,testId,date],
                expect.any(Function)
            );

        });

        test('It should reject when the counter and/or the service are not in the database', async () => {

            jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback.bind({ changes: 0 })(null); 
                return {} as Database; 
            });

            await expect(dao.deleteCounterService(testId,testId)).rejects.toEqual("Counter and/or service not found.");
    
            expect(db.run).toHaveBeenCalledWith(
              `DELETE FROM counter_service 
                        WHERE counterId = ? AND serviceId = ? AND date = ?`,
                [testId,testId,date],
                expect.any(Function)
            );

        });
        
        test('It should reject with an error if the database operation fails', async () => {

            jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback.bind({ changes: 1 })(mockError); 
                return {} as Database; 
            });

            await expect(dao.deleteCounterService(testId,testId)).rejects.toThrow('Database error');
    
            expect(db.run).toHaveBeenCalledWith(
                `DELETE FROM counter_service 
                        WHERE counterId = ? AND serviceId = ? AND date = ?`,
                [testId,testId,date],
                expect.any(Function)
            );
        });

    });

    describe('viewAllServicesByCounterToday', () => {
        test('It should successfully return all service types that manage a counter based on the counter id and date (today)', async () => {

            jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
                callback(null, mockServices);
                return {} as Database;
            });

            const response = await dao.viewAllServicesByCounterToday(testId);

            expect(db.all).toHaveBeenCalledWith(
                `SELECT id, name, serviceTime
                        FROM counter_service, service
                        WHERE counter_service.serviceId = service.id
                            AND counter_service.counterId = ? AND date = ?`,
                [testId,date],
                expect.any(Function)
            );
            expect(response).toEqual(mockServices);

        });

        test('It should return an empty array if no services found', async () => {

            jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
                callback(null, []);
                return {} as Database;
            });

            const response = await dao.viewAllServicesByCounterToday(testId);

            expect(db.all).toHaveBeenCalledWith(
                `SELECT id, name, serviceTime
                        FROM counter_service, service
                        WHERE counter_service.serviceId = service.id
                            AND counter_service.counterId = ? AND date = ?`,
                [testId,date],
                expect.any(Function)
            );
            expect(response).toEqual([]);

        });

        test("It should reject with an error if there is a database error", async () => {

            jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
                callback(mockError, null);
                return {} as Database;
            });
            
            await expect(dao.viewAllServicesByCounterToday(testId)).rejects.toThrow('Database error');

        });
    });

});