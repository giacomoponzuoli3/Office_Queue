import { describe, test, expect, jest, afterEach, afterAll } from "@jest/globals"
import db from "../../src/db/db"
import { Database, RunResult } from "sqlite3"
import QueueDAO from "../../src/dao/queueDAO"
import exp from "constants"
import { Queue } from "../../src/components/queue"


jest.mock("../../src/db/db.ts")

function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');  // Ottiene il giorno e aggiunge lo zero iniziale se necessario
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Ottiene il mese (nota: i mesi partono da 0)
    const year = date.getFullYear();  // Ottiene l'anno

    return `${day}/${month}/${year}`;
}

// Reset all mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});

afterAll(() => {
    jest.clearAllMocks();
})

describe("Queue DAO", () => {
    //---------- getQueue ------------------//
    describe("getQueue", () => {
        test("It should return a queue by specifing id and date", async () => {
            const queueDAO = new QueueDAO();

            jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback) => {
                const row = {serviceId: 2, date: formatDate(new Date()), length: 3};

                callback(null, row);

                return {} as Database;
            });

            const queue = await queueDAO.getQueue(2, new Date()); //data non importa

            expect(queue).toEqual({serviceId: 2, date: formatDate(new Date()), length: 3});
        });

        test("It should reject because there isn't the queue with specified id", async () => {
            const queueDAO = new QueueDAO();
            const error = "No queue found with specified id";

            jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback) => {
                callback(undefined, null); 

                return {} as Database;
            });

            await expect(queueDAO.getQueue(3, new Date())).rejects.toEqual(error);
        });

        test("It should reject with error during db.get", async () => {
            const queueDAO = new QueueDAO();

            const error = new Error("Database error");

            // Mock della funzione db.all per simulare un errore nel recupero dei dati dal database
            jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback) => {
                // Chiamata alla callback con un errore simulato
                callback(error, null);

                return {} as Database;
            });

            await expect(queueDAO.getQueue(2, new Date())).rejects.toThrow(error);

        });

    });

    //---------- addQueue ------------------//
    describe("addQueue", () => {
        test("It should resolve void", async () => { 
            const queueDAO = new QueueDAO();

            jest.spyOn(db, 'run').mockImplementation((sql, params, callback) => {
                callback.call({ lastID: 1 }, null);  // Successful insert
                return {} as Database;
            });

            await expect(queueDAO.addQueue(3, new Date())).resolves.toBeUndefined();
        });

        test("It should reject with error in db", async () => {
            const queueDAO = new QueueDAO();
            const error = new Error("Error during the db.run");

            jest.spyOn(db, 'run').mockImplementation((sql, params, callback) => {
                callback.call(null, error);  // Error in the insert
                return {} as Database;
            });

            await expect(queueDAO.addQueue(3, new Date())).rejects.toThrow(error);
        });

    });

    //---------- addCustomerToQueue -------//
    /**
     * Qui dovremmo gestire la run e la get tramite await perché sono due chiamate asincrone
     */
    describe("addCustomerToQueue", () => {
        test("It should resolve",async () => {
           const queueDAO = new QueueDAO();
           
            jest.spyOn(db, "run").mockImplementation((sql: string, params: any[], callback) => {
                callback(null);
                return {} as Database;
            });

            jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback) => {
                const row = {serviceId: "2", date: "24/12/2024", length: 3};
                
                callback(null, row);
                return {} as Database;
            });

            await expect(queueDAO.addCustomerToQueue(2, new Date())).resolves.toEqual({serviceId: "2", date: "24/12/2024", length: 3});
        });

        test("It should reject with an error in db.run", async () => {
           const queueDAO = new QueueDAO();
           const error = new Error("Database error");

            jest.spyOn(db, "run").mockImplementation((sql: string, params: any[], callback) => {
                callback(error, null); //error in db.run
                return {} as Database
            });
            /*
            //Non importa fare il mock di db.get
            jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback) => {
                callback(error, null);
                return {} as Database;
            });
            */
           
            await expect(queueDAO.addCustomerToQueue(2, new Date())).rejects.toThrow(error);
        });

        test("It should reject with an error in db.get", async () => {
            const queueDAO = new QueueDAO();
            const error = new Error("Database error");

            jest.spyOn(db, "run").mockImplementation((sql: string, params: any[], callback) => {
                callback(null); //resolve db.run
                return {} as Database
            });

            jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback) => {
                callback(error, null); //error in db.get
                return {} as Database;
            });
           
            await expect(queueDAO.addCustomerToQueue(2, new Date())).rejects.toThrow(error);
        });

        test("It should reject with row == undefined", async () => {
            const queueDAO = new QueueDAO();
            
            const error = "No queue found with specified serviceId for specified date";

            jest.spyOn(db, "run").mockImplementation((sql: string, params: any[], callback) => {
                callback(null); //resolve db.run
                return {} as Database
            });

            jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback) => {
                callback(undefined, null); //error in db.get
                return {} as Database;
            });
           
            await expect(queueDAO.addCustomerToQueue(2, new Date())).rejects.toEqual(error);
        
            
         });
    });

    //---------- deleteQueue --------------//
    describe("deleteQueue", () => {
        test("It should resolve",async () => {
            const queueDAO = new QueueDAO();

            jest.spyOn(db, "run").mockImplementation((sql: string, params: any[], callback) => {
                callback(null);
                return {} as Database;
            });

            await expect(queueDAO.deleteQueue(3, new Date())).resolves.toBeUndefined();
        });

        test("It should reject with error in db.run",async () => {
            const queueDAO = new QueueDAO();
            const error = new Error("Database error");

            jest.spyOn(db, "run").mockImplementation((sql: string, params: any[], callback) => {
                callback(error, null);
                return {} as Database;
            });

            await expect(queueDAO.deleteQueue(3, new Date())).rejects.toThrow(error);
        
        });
    });
    
    describe("getQueuesForCounter", () => {
        test("It should return an array of Queue objects", async () => {
            const queueDAO = new QueueDAO();
    
            const mockRows = [
                { serviceId: 1, date: new Date(), length: 5 },
                { serviceId: 2, date: new Date(), length: 3 }
            ];
    
            jest.spyOn(db, "all").mockImplementation((sql: string, params: any[], callback) => {
                callback(null, mockRows);
                return {} as Database;
            });
    
            const result = await queueDAO.getQueuesForCounter(1);
    
            expect(result).toEqual([
                new Queue(1, mockRows[0].date, mockRows[0].length),
                new Queue(2, mockRows[1].date, mockRows[1].length)
            ]);
        });
    
        test("It should reject with error in db.all", async () => {
            const queueDAO = new QueueDAO();
            const error = new Error("Database error");
    
            jest.spyOn(db, "all").mockImplementation((sql: string, params: any[], callback) => {
                callback(error, null);
                return {} as Database;
            });
    
            await expect(queueDAO.getQueuesForCounter(1)).rejects.toThrow(error);
        });
    });

    describe("removeTicketFromQueue", () => {
        test("It should reject with error when db.run fails", async () => {
            const queueDAO = new QueueDAO();
            const error = new Error("Database error");
    
            jest.spyOn(db, "run").mockImplementation((sql: string, params: any[], callback) => {
                callback(error);
                return {} as Database;
            });
    
            await expect(queueDAO.removeTicketFromQueue(3)).rejects.toThrow(error);
        });
    });
    
    describe("resetQueues", () => {
        test("It should reject with error when db.run fails", async () => {
            const queueDAO = new QueueDAO();
            const error = new Error("Database error");
    
            // Mock del metodo db.run per simulare un errore
            jest.spyOn(db, "run").mockImplementation((sql: string, params: any[], callback) => {
                callback(error); // Simula errore nel database
                return {} as Database;
            });
    
            await expect(queueDAO.resetQueues()).rejects.toThrow(error);
        });
    });
    
});