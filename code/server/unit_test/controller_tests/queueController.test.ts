import { describe, test, expect, jest, afterEach, afterAll } from "@jest/globals"
import db from "../../src/db/db"
import { Database, RunResult } from "sqlite3"
import QueueDAO from "../../src/dao/queueDAO"
import QueueController from "../../src/controllers/queueController"
import { Queue } from "../../src/components/queue"
import { Ticket } from "../../src/components/ticket"
import TicketDAO from "../../src/dao/ticketDAO"
import ServiceDAO from "../../src/dao/serviceDAO"
import exp from "constants"

jest.mock("../../src/db/db.ts")

function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');  // Ottiene il giorno e aggiunge lo zero iniziale se necessario
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Ottiene il mese (nota: i mesi partono da 0)
    const year = date.getFullYear();  // Ottiene l'anno

    return `${day}/${month}/${year}`;
}

afterEach(() => {
    jest.clearAllMocks(); // Ripristina tutti i mock dopo ogni test
});

afterAll(() => {
    jest.clearAllMocks();

})

describe(("Queue controller"), () => {

    //-------- getQueue ---------------//
    describe(("getQueue"), () => {
        test("It should resolve with return of a queue", async ()  => {
            //definisco una coda di test
            const date = new Date();
            const queue_input = new Queue(3,date, 3);
            //Mock il metodo getQueue del DAO per restituire un oggetto Queue
            jest.spyOn(QueueDAO.prototype, "getQueue").mockResolvedValueOnce(queue_input);
            
            //controller
            const controller = new QueueController();

            //chiamare il metodo getQueue del controller
            const response = await controller.getQueue("3", new Date());

            //Aspettarsi che il metodo getQueue del DAO sia stato chiamato una volta sola
            expect(QueueDAO.prototype.getQueue).toHaveBeenCalledTimes(1);
            // Aspettarsi che sia stato chiamato con i parametri corretti
            expect(QueueDAO.prototype.getQueue).toHaveBeenCalledWith("3", date);
            
            //aspettarsi che la risposta sia void 
            expect(response).toEqual(queue_input);
        });

        test("It should reject with an error", async () => {
            //definisco una coda di test
            const date = new Date();
            const queue_input = new Queue(3, date, 3);

            const error = new Error("Error during getQueue");

            //Mock il metodo getQueue del DAO per restituire un oggetto Queue
            jest.spyOn(QueueDAO.prototype, "getQueue").mockRejectedValueOnce(error);
            
            //controller
            const controller = new QueueController();

            //chiamare il metodo getQueue del controller
            await expect(controller.getQueue(queue_input.serviceId.toString(), date)).rejects.toThrow(error);

            //Aspettarsi che il metodo getQueue del DAO sia stato chiamato una volta sola
            expect(QueueDAO.prototype.getQueue).toHaveBeenCalledTimes(1);
            // Aspettarsi che sia stato chiamato con i parametri corretti
            expect(QueueDAO.prototype.getQueue).toHaveBeenCalledWith("3", date);
            
        });


    });

    //-------- addQueue -----------//
    describe(("addQueue"), () => {
        test("It should resolve void", async () => {
            //definisco una coda di test
            const date = new Date();
            const queue_input = new Queue(3, date, 3);

            //Mock il metodo addQueue del DAO per restituire un oggetto Queue
            jest.spyOn(QueueDAO.prototype, "addQueue").mockResolvedValueOnce(undefined);
            
            //controller
            const controller = new QueueController();

            //chiamo il metodo addQueue del controller
            const response = await controller.addQueue(queue_input.serviceId.toString(), date);

            //Aspettarsi che il metodo addQueue del DAO sia stato chiamato una volta sola
            expect(QueueDAO.prototype.addQueue).toHaveBeenCalledTimes(1);
            // Aspettarsi che sia stato chiamato con i parametri corretti
            expect(QueueDAO.prototype.addQueue).toHaveBeenCalledWith(queue_input.serviceId.toString(), date);
            
            expect(response).toBe(undefined);
        });

        test("It should reject with an error", async () => {
            //definisco una coda di test
            const date = new Date();
            const queue_input = new Queue(3, date, 3);

            const error = new Error("Error during addQueue");

            //Mock il metodo addQueue del DAO per restituire un oggetto Queue
            jest.spyOn(QueueDAO.prototype, "addQueue").mockRejectedValueOnce(error);
            
            //controller
            const controller = new QueueController();

            //chiamare il metodo addQueue del controller
            await expect(controller.addQueue(queue_input.serviceId.toString(), date)).rejects.toThrow(error);

            //Aspettarsi che il metodo addQueue del DAO sia stato chiamato una volta sola
            expect(QueueDAO.prototype.addQueue).toHaveBeenCalledTimes(1);
            // Aspettarsi che sia stato chiamato con i parametri corretti
            expect(QueueDAO.prototype.addQueue).toHaveBeenCalledWith(queue_input.serviceId.toString(), date);
            
        });
    });

    //-------- deleteQueue ----------------------------//
    describe(("deleteQueue"), () => {
        test("It should resolve void", async ()  => {
            //definisco una coda di test
            const date = new Date();
            const queue_input = new Queue(3, date, 3);

            //Mock il metodo deleteQueue del DAO per restituire un oggetto Queue
            jest.spyOn(QueueDAO.prototype, "deleteQueue").mockResolvedValueOnce(undefined);
            
            //controller
            const controller = new QueueController();

            //chiamo il metodo deleteQueue del controller
            const response = await controller.deleteQueue(queue_input.serviceId.toString(), date);

            //Aspettarsi che il metodo deleteQueue del DAO sia stato chiamato una volta sola
            expect(QueueDAO.prototype.deleteQueue).toHaveBeenCalledTimes(1);
            // Aspettarsi che sia stato chiamato con i parametri corretti
            expect(QueueDAO.prototype.deleteQueue).toHaveBeenCalledWith(queue_input.serviceId.toString(), date);
            
            expect(response).toBe(undefined);
        });

        test("It should reject with an error", async ()  => {
            //definisco una coda di test
            const date = new Date();
            const queue_input = new Queue(3, date, 3);

            const error = new Error("Error during deleteQueue");

            //Mock il metodo deleteQueue del DAO per restituire un oggetto Queue
            jest.spyOn(QueueDAO.prototype, "deleteQueue").mockRejectedValueOnce(error);
            
            //controller
            const controller = new QueueController();

            //chiamare il metodo deleteQueue del controller
            await expect(controller.deleteQueue(queue_input.serviceId.toString(), date)).rejects.toThrow(error);

            //Aspettarsi che il metodo deleteQueue del DAO sia stato chiamato una volta sola
            expect(QueueDAO.prototype.deleteQueue).toHaveBeenCalledTimes(1);
            // Aspettarsi che sia stato chiamato con i parametri corretti
            expect(QueueDAO.prototype.deleteQueue).toHaveBeenCalledWith(queue_input.serviceId.toString(), date);
            
        });
    });

    //-------- addCustomerToQueue ------------------------//
    describe(("addCustomerToQueue"), () => {
        test("It should resolve with return of a queue", async ()  => {
            //definisco una coda di test
            const date = new Date();
            const queue_input = new Queue(3, date, 3);
            //Mock il metodo addCustomerToQueue del DAO per restituire un oggetto Queue
            jest.spyOn(QueueDAO.prototype, "addCustomerToQueue").mockResolvedValueOnce(queue_input);
            
            //controller
            const controller = new QueueController();

            //chiamare il metodo addCustomerToQueue del controller
            const response = await controller.addCustomerToQueue("3", new Date());

            //Aspettarsi che il metodo addCustomerToQueue del DAO sia stato chiamato una volta sola
            expect(QueueDAO.prototype.addCustomerToQueue).toHaveBeenCalledTimes(1);
            // Aspettarsi che sia stato chiamato con i parametri corretti
            expect(QueueDAO.prototype.addCustomerToQueue).toHaveBeenCalledWith("3", date);
            
            //aspettarsi che la risposta sia void 
            expect(response).toEqual(queue_input);
        });

        test("It should reject with an error", async ()  => {
            //definisco una coda di test
            const date = new Date();
            const queue_input = new Queue(3, date, 3);

            const error = new Error("Error during addCustomerToQueue");

            //Mock il metodo addCustomerToQueue del DAO per restituire un oggetto Queue
            jest.spyOn(QueueDAO.prototype, "addCustomerToQueue").mockRejectedValueOnce(error);
            
            //controller
            const controller = new QueueController();

            //chiamare il metodo addCustomerToQueue del controller
            await expect(controller.addCustomerToQueue(queue_input.serviceId.toString(), date)).rejects.toThrow(error);

            //Aspettarsi che il metodo addCustomerToQueue del DAO sia stato chiamato una volta sola
            expect(QueueDAO.prototype.addCustomerToQueue).toHaveBeenCalledTimes(1);
            // Aspettarsi che sia stato chiamato con i parametri corretti
            expect(QueueDAO.prototype.addCustomerToQueue).toHaveBeenCalledWith("3", date);
            
        });
    });

    describe("callNextTicket", () => {
        test("It should resolve with the next ticket", async () => {
            const counterId = 1;
            const queues = [
                new Queue(1, new Date(), 3),
                new Queue(2, new Date(), 5)
            ];
            const longestQueue = queues[1];
            const nextTicket = new Ticket(10, longestQueue.serviceId, "2024-10-15",1);
    
            jest.spyOn(QueueDAO.prototype, "getQueuesForCounter").mockResolvedValueOnce(queues);
            jest.spyOn(QueueController.prototype, "findLongestQueue").mockResolvedValueOnce(longestQueue);
            jest.spyOn(QueueController.prototype, "selectNextTicket").mockResolvedValueOnce(nextTicket);
            jest.spyOn(TicketDAO.prototype, "issuedTicket").mockResolvedValueOnce(undefined);
            jest.spyOn(QueueDAO.prototype, "removeTicketFromQueue").mockResolvedValueOnce(undefined);
    
            const controller = new QueueController();
            const response = await controller.callNextTicket(counterId);
    
            expect(QueueDAO.prototype.getQueuesForCounter).toHaveBeenCalledWith(counterId);
            expect(QueueController.prototype.findLongestQueue).toHaveBeenCalledWith(queues);
            expect(QueueController.prototype.selectNextTicket).toHaveBeenCalledWith(longestQueue);
            expect(TicketDAO.prototype.issuedTicket).toHaveBeenCalledWith(nextTicket.id, counterId);
            expect(QueueDAO.prototype.removeTicketFromQueue).toHaveBeenCalledWith(longestQueue.serviceId);
            expect(response).toEqual(nextTicket);
        });
    
        test("It should resolve with null if no queues available", async () => {
            const counterId = 1;
            const queues: Queue[] = []; 
    
            jest.spyOn(QueueDAO.prototype, "getQueuesForCounter").mockResolvedValueOnce(queues);
            jest.spyOn(QueueController.prototype, "findLongestQueue").mockResolvedValueOnce(undefined);

            const controller = new QueueController();
            const response = await controller.callNextTicket(counterId);

            expect(QueueDAO.prototype.getQueuesForCounter).toHaveBeenCalledWith(counterId);
            expect(QueueController.prototype.findLongestQueue).toHaveBeenCalledWith(queues);
            expect(response).toBeNull();
        });
    
        test("It should reject with an error if something fails", async () => {
            const counterId = 1;
            const error = new Error("Error during queue processing");
            jest.spyOn(QueueDAO.prototype, "getQueuesForCounter").mockRejectedValueOnce(error);

            const controller = new QueueController();
    
            await expect(controller.callNextTicket(counterId)).rejects.toThrow(error);
            expect(QueueDAO.prototype.getQueuesForCounter).toHaveBeenCalledWith(counterId);
        });
    });
    
    describe("findLongestQueue", () => {
        test("It should return undefined if no queues are provided", async () => {
            const queues: Queue[] = [];
    
            jest.spyOn(ServiceDAO.prototype, "getServices").mockResolvedValueOnce([]);
    
            const controller = new QueueController();
    
            const result = await controller.findLongestQueue(queues);
    
            expect(result).toBeUndefined();
        });
    
        test("It should return the only queue if only one queue is provided", async () => {
            const queues: Queue[] = [new Queue(1, new Date(), 5)];
    
            jest.spyOn(ServiceDAO.prototype, "getServices").mockResolvedValueOnce([]);
    
            const controller = new QueueController();
            const result = await controller.findLongestQueue(queues);
    
            expect(result).toEqual(queues[0]); 
        });
    
        test("It should return the longest queue if multiple queues are provided", async () => {
            const queues: Queue[] = [
                new Queue(1, new Date(), 3),
                new Queue(2, new Date(), 5), 
                new Queue(3, new Date(), 2)
            ];
    
            jest.spyOn(ServiceDAO.prototype, "getServices").mockResolvedValueOnce([]);
    
            const controller = new QueueController();
            const result = await controller.findLongestQueue(queues);
    
            expect(result).toEqual(queues[1]); 
        });
    });

    describe("selectNextTicket", () => {
        test("It should return the ticket with the lowest position in the queue", async () => {
            const queue = new Queue(1, new Date(), 5);
    
            const tickets = [
                { id: 1, serviceId: 1, position_queue: 3, is_served: 0, date_issued: "2024-10-15" },
                { id: 2, serviceId: 1, position_queue: 2, is_served: 0, date_issued: "2024-10-15" },
                { id: 3, serviceId: 1, position_queue: 1, is_served: 0, date_issued: "2024-10-15" } 
            ];
    
            jest.spyOn(TicketDAO.prototype, "getTicketsByService").mockResolvedValueOnce(tickets);
    
            const controller = new QueueController();
            const result = await controller.selectNextTicket(queue);
    
            expect(result).toEqual({ id: 3, serviceId: 1, position_queue: 1, is_served: 0, date_issued: "2024-10-15" });
        });
    
        test("It should return the last ticket if all tickets have the same position", async () => {
            const queue = new Queue(1, new Date(), 5);
    
            const tickets = [
                { id: 1, serviceId: 1, position_queue: 1, is_served: 0, date_issued: "2024-10-15" },
                { id: 2, serviceId: 1, position_queue: 1, is_served: 0, date_issued: "2024-10-15" },
                { id: 3, serviceId: 1, position_queue: 1, is_served: 0, date_issued: "2024-10-15" }
            ];
    
            jest.spyOn(TicketDAO.prototype, "getTicketsByService").mockResolvedValueOnce(tickets);
    
            const controller = new QueueController();
            const result = await controller.selectNextTicket(queue);
    
            expect(result).toEqual({ id: 3, serviceId: 1, position_queue: 1, is_served: 0, date_issued: "2024-10-15" });
        });
    
        test("It should throw an error if ticketDAO.getTicketsByService fails", async () => {
            const queue = new Queue(1, new Date(), 5);
    
            jest.spyOn(TicketDAO.prototype, "getTicketsByService").mockRejectedValueOnce(new Error("Ticket retrieval failed"));
    
            const controller = new QueueController();
    
            await expect(controller.selectNextTicket(queue)).rejects.toThrow("Ticket retrieval failed");
        });
    });

    describe("resetQueues", () => {
        test("It should call dao.resetQueues once", async () => {
            jest.spyOn(QueueDAO.prototype, "resetQueues").mockResolvedValueOnce();
    
            const controller = new QueueController();
    
            await controller.resetQueues();
    
            expect(QueueDAO.prototype.resetQueues).toHaveBeenCalledTimes(1);
        });
    
        test("It should throw an error if dao.resetQueues fails", async () => {
            jest.spyOn(QueueDAO.prototype, "resetQueues").mockRejectedValueOnce(new Error("Failed to reset queues"));
    
            const controller = new QueueController();
    
            await expect(controller.resetQueues()).rejects.toThrow("Failed to reset queues");
        });
    });
    
    
});

