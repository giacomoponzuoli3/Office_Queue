import { describe, test, expect, jest, afterEach, beforeAll, afterAll } from "@jest/globals"
import db from "../../src/db/db"
import { Database } from "sqlite3"
import QueueDAO from "../../src/dao/queueDAO"
import QueueController from "../../src/controllers/queueController"
import { Queue } from "../../src/components/queue"
import { Ticket } from "../../src/components/ticket"
import TicketDAO from "../../src/dao/ticketDAO"
import ServiceDAO from "../../src/dao/serviceDAO"
import ServiceController from "../../src/controllers/serviceController"
import CounterController from "../../src/controllers/counterController"
import { setup} from "../../src/db/setup";
import { cleanup } from "../../src/db/cleanup";

const date = new Date();
const id = "1";
const testId = 1;
const queue_input = new Queue(1,date, 0);
const serviceController = new ServiceController();
const counterController = new CounterController();
const controller = new QueueController();
const dao = new QueueDAO();
const ticketDAO = new TicketDAO();
const testName = "service x";
const testTime = 10;


function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');  // Ottiene il giorno e aggiunge lo zero iniziale se necessario
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Ottiene il mese (nota: i mesi partono da 0)
    const year = date.getFullYear();  // Ottiene l'anno

    return `${day}/${month}/${year}`;
}

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


    //-------- getQueue ---------------//
    describe(("getQueue"), () => {
        test("It should resolve with return of a queue", async ()  => {
         
            await expect(serviceController.addService(testName,testTime)).resolves.toBeUndefined();

            await expect(serviceController.getService(testId)).resolves.toStrictEqual({
                "id": 1,
                "name": "service X",
                "serviceTime": 10,
              });

            await expect(controller.addQueue(id,date)).resolves.toBeUndefined();
   
            const response = await controller.getQueue(id, new Date());

            expect(dao.getQueue).toHaveBeenCalledTimes(1);
            expect(dao.getQueue).toHaveBeenCalledWith(id, date);

            expect(response).toEqual(queue_input);
        });

        test("It should reject with an error if there is no service id", async () => {

            const response = await controller.getQueue(id, new Date());

            expect(dao.getQueue).toHaveBeenCalledTimes(1);
            expect(dao.getQueue).toHaveBeenCalledWith(id, date);

            expect(response).rejects.toEqual("No queue found with specified id");
        });

        test("It should reject with an error if there is a database error", async () => {

            const dbSpy = jest.spyOn(db, 'get').mockImplementation(function (sql, params, callback) {
                callback(new Error('Database error'), null);
                return {} as Database;
            });
            
            await expect(controller.getQueue(id,date)).rejects.toThrow("Database error");

            dbSpy.mockRestore();
        });


    });

    //-------- addQueue -----------//
    describe(("addQueue"), () => {
        test("It should resolve void", async () => {
            await expect(serviceController.addService(testName,testTime)).resolves.toBeUndefined();

            await expect(serviceController.getService(testId)).resolves.toStrictEqual({
                "id": 1,
                "name": "service X",
                "serviceTime": 10,
              });

            await expect(controller.addQueue(id,date)).resolves.toBeUndefined();
   
            const response = await controller.getQueue(id, new Date());

            expect(dao.getQueue).toHaveBeenCalledTimes(1);
            expect(dao.getQueue).toHaveBeenCalledWith(id, date);

            expect(response).toEqual(queue_input);
        });

        test("It should reject with an error if there is a database error", async () => {

            const dbSpy = jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback(new Error('Database error'), null);
                return {} as Database;
            });
            
            await expect(controller.addQueue(id,date)).rejects.toThrow("Database error");

            dbSpy.mockRestore();
        });
    });

    //-------- deleteQueue ----------------------------//
    describe(("deleteQueue"), () => {
        test("It should resolve void", async ()  => {
            await expect(serviceController.addService(testName,testTime)).resolves.toBeUndefined();

            await expect(serviceController.getService(testId)).resolves.toStrictEqual({
                "id": 1,
                "name": "service X",
                "serviceTime": 10,
              });

            await expect(controller.addQueue(id,date)).resolves.toBeUndefined();
   
            let response = await controller.getQueue(id, new Date());

            expect(dao.getQueue).toHaveBeenCalledTimes(1);
            expect(dao.getQueue).toHaveBeenCalledWith(id, date);

            expect(response).toEqual(queue_input);

            await expect(controller.deleteQueue(id,date)).resolves.toBeUndefined();

            response = await controller.getQueue(id, new Date());

            expect(dao.getQueue).toHaveBeenCalledTimes(1);
            expect(dao.getQueue).toHaveBeenCalledWith(id, date);

            expect(response).rejects.toEqual("No queue found with specified id");
        });

        test("It should reject with an error if there is a database error", async () => {
            
            const dbSpy = jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback(new Error('Database error'), null);
                return {} as Database;
            });
            
            await expect(controller.deleteQueue(id,date)).rejects.toThrow("Database error");

            dbSpy.mockRestore();
            
        });
    });

    //-------- addCustomerToQueue ------------------------//
    describe(("addCustomerToQueue"), () => {
        test("It should resolve with return of a queue", async ()  => {
            await expect(serviceController.addService(testName,testTime)).resolves.toBeUndefined();

            await expect(serviceController.getService(testId)).resolves.toStrictEqual({
                "id": 1,
                "name": "service X",
                "serviceTime": 10,
              });

            await expect(controller.addQueue(id,date)).resolves.toBeUndefined();

            await expect(controller.addCustomerToQueue(id,date)).resolves.toStrictEqual(new Queue(1,date,1));
        });

        test("It should reject with an error if there is no service id", async () => {

            const response = await controller.addCustomerToQueue(id, new Date());

            expect(response).rejects.toEqual("No queue found with specified serviceId for specified date");
        });

        test("It should reject with an error if there is no date", async () => {

            await expect(serviceController.addService(testName,testTime)).resolves.toBeUndefined();

            await expect(serviceController.getService(testId)).resolves.toStrictEqual({
                "id": 1,
                "name": "service X",
                "serviceTime": 10,
              });

            await expect(controller.addQueue(id,date)).resolves.toBeUndefined();

            const response = await controller.addCustomerToQueue(id, new Date("2000-10-20"));

            expect(response).rejects.toEqual("No queue found with specified serviceId for specified date");
        });


        test("It should reject with an error if there is a database error", async () => {

            const dbSpy = jest.spyOn(db, 'get').mockImplementation(function (sql, params, callback) {
                callback(new Error('Database error'), null);
                return {} as Database;
            });
            
            await expect(controller.getQueue(id,date)).rejects.toThrow("Database error");

            dbSpy.mockRestore();
        });
    });

    describe("callNextTicket", () => {
        test("It should resolve with the next ticket", async () => {

            await expect(counterController.addCounter("Counter1")).resolves.toBeUndefined();

            await expect(serviceController.addService(testName,testTime)).resolves.toBeUndefined();
            await expect(serviceController.addService("Service2",testTime)).resolves.toBeUndefined();

            await expect(controller.addQueue(id,date)).resolves.toBeUndefined();
            await expect(controller.addQueue("2",date)).resolves.toBeUndefined();

            await expect(controller.addCustomerToQueue(id,date)).resolves.toBeUndefined();

            const queue1 = await controller.getQueue(id,date);
            const queue2 = await controller.getQueue("2",date);
    
            const queues = await dao.getQueuesForCounter(1);
            expect(queues).toStrictEqual([queue1,queue2]);
            await expect(controller.findLongestQueue(queues)).resolves.toStrictEqual(queue1);

            const nextTicket = new Ticket(10, queue1.serviceId, "2024-10-15",1);
            await expect(controller.selectNextTicket(queue1)).resolves.toStrictEqual(nextTicket);
       
            await expect(ticketDAO.issuedTicket(nextTicket.id,1)).resolves.toBeUndefined();

            await expect(dao.removeTicketFromQueue(queue1.serviceId)).resolves.toBeUndefined();

            await expect(controller.callNextTicket(1)).resolves.toStrictEqual(nextTicket);

        });
    
        test("It should resolve with null if no queues available", async () => {
  
            await expect(counterController.addCounter("Counter1")).resolves.toBeUndefined();

            await expect(serviceController.addService(testName,testTime)).resolves.toBeUndefined();
            await expect(serviceController.addService("Service2",testTime)).resolves.toBeUndefined();
    
            expect (dao.getQueuesForCounter(1)).toStrictEqual([]);
            expect (controller.findLongestQueue([])).resolves.toBeUndefined();
            await expect(controller.callNextTicket(1)).resolves.toBeNull();
            
        });
    
      
        test("It should reject with an error if there is a database error", async () => {

            const dbSpy = jest.spyOn(db, 'all').mockImplementation(function (sql, params, callback) {
                callback(new Error('Database error'), null);
                return {} as Database;
            });
            
            await expect(controller.callNextTicket(1)).rejects.toThrow("Database error");

            dbSpy.mockRestore();

        });
    });
    
    describe("findLongestQueue", () => {
        test("It should return undefined if no queues are provided", async () => {
            await expect(counterController.addCounter("Counter1")).resolves.toBeUndefined();

            await expect(serviceController.addService(testName,testTime)).resolves.toBeUndefined();
            await expect(serviceController.addService("Service2",testTime)).resolves.toBeUndefined();
    
            const queues = await dao.getQueuesForCounter(1);
            expect(queues).toStrictEqual([]);
            await expect(controller.findLongestQueue(queues)).resolves.toBeUndefined();
        });
    
        test("It should return the only queue if only one queue is provided", async () => {
            await expect(counterController.addCounter("Counter1")).resolves.toBeUndefined();

            await expect(serviceController.addService(testName,testTime)).resolves.toBeUndefined();
            await expect(serviceController.addService("Service2",testTime)).resolves.toBeUndefined();

            await expect(controller.addQueue(id,date)).resolves.toBeUndefined();

            await expect(controller.addCustomerToQueue(id,date)).resolves.toBeUndefined();

            const queue1 = await controller.getQueue(id,date);
    
            const queues = await dao.getQueuesForCounter(1);
            expect(queues).toStrictEqual([queue1]);
            await expect(controller.findLongestQueue(queues)).resolves.toStrictEqual(queue1);
            
        });
    
        test("It should return the longest queue if multiple queues are provided", async () => {

            await expect(counterController.addCounter("Counter1")).resolves.toBeUndefined();

            await expect(serviceController.addService(testName,testTime)).resolves.toBeUndefined();
            await expect(serviceController.addService("Service2",testTime)).resolves.toBeUndefined();

            await expect(controller.addQueue(id,date)).resolves.toBeUndefined();
            await expect(controller.addQueue("2",date)).resolves.toBeUndefined();

            await expect(controller.addCustomerToQueue(id,date)).resolves.toBeUndefined();

            const queue1 = await controller.getQueue(id,date);
            const queue2 = await controller.getQueue("2",date);
    
            const queues = await dao.getQueuesForCounter(1);
            expect(queues).toStrictEqual([queue1,queue2]);
            await expect(controller.findLongestQueue(queues)).resolves.toStrictEqual(queue1);

        });
    });

    describe("selectNextTicket", () => {
        test("It should return the ticket with the lowest position in the queue", async () => {
            await expect(counterController.addCounter("Counter1")).resolves.toBeUndefined();

            await expect(serviceController.addService(testName,testTime)).resolves.toBeUndefined();
            await expect(serviceController.addService("Service2",testTime)).resolves.toBeUndefined();

            await expect(controller.addQueue(id,date)).resolves.toBeUndefined();

            const queue = await controller.getQueue(id,date);

            /*
            await expect(TicketDAO.addTicket(1)).resolves.toBeUndefined();
            await expect(TicketDAO.addTicket(1)).resolves.toBeUndefined();
            await expect(TicketDAO.addTicket(1)).resolves.toBeUndefined();
            */

            const tickets = await expect(ticketDAO.getTicketsByService(1));
    
            const result = await controller.selectNextTicket(queue);
    
            expect(result).toEqual(tickets[2]);

        });
    
        test("It should return the last ticket if all tickets have the same position", async () => {
            await expect(counterController.addCounter("Counter1")).resolves.toBeUndefined();

            await expect(serviceController.addService(testName,testTime)).resolves.toBeUndefined();
            await expect(serviceController.addService("Service2",testTime)).resolves.toBeUndefined();

            await expect(controller.addQueue(id,date)).resolves.toBeUndefined();

            const queue = await controller.getQueue(id,date);

            /*
            await expect(TicketDAO.addTicket(1)).resolves.toBeUndefined();
            await expect(TicketDAO.addTicket(1)).resolves.toBeUndefined();
            await expect(TicketDAO.addTicket(1)).resolves.toBeUndefined();
            */

            const tickets = await expect(ticketDAO.getTicketsByService(1));
    
            const result = await controller.selectNextTicket(queue);
    
            expect(result).toEqual(tickets[2]);
        });
    

        test("It should reject with an error if there is a database error", async () => {

            await expect(counterController.addCounter("Counter1")).resolves.toBeUndefined();

            await expect(serviceController.addService(testName,testTime)).resolves.toBeUndefined();
            await expect(serviceController.addService("Service2",testTime)).resolves.toBeUndefined();

            await expect(controller.addQueue(id,date)).resolves.toBeUndefined();

            const queue = await controller.getQueue(id,date);


            const dbSpy = jest.spyOn(db, 'get').mockImplementation(function (sql, params, callback) {
                callback(new Error('Database error'), null);
                return {} as Database;
            });
            
            await expect(controller.selectNextTicket(queue)).rejects.toThrow("Database error");

            dbSpy.mockRestore();

        });
    });

    describe("resetQueues", () => {
        test("It should call dao.resetQueues once", async () => {
            await controller.resetQueues();
    
            expect(dao.resetQueues).toHaveBeenCalledTimes(1);
        });
    
        test("It should reject with an error if there is a database error", async () => {

            const dbSpy = jest.spyOn(db, 'run').mockImplementation(function (sql, params, callback) {
                callback(new Error('Database error'), null);
                return {} as Database;
            });
            
            await expect(controller.resetQueues()).rejects.toThrow("Database error");

            dbSpy.mockRestore();

        });
    });
    
    
});