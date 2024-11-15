import QueueDAO from "../dao/queueDAO";
import ServiceDAO from "../dao/serviceDAO";
import {Queue} from "../components/queue";
import {Ticket} from "../components/ticket";
import TicketDAO from "../dao/ticketDAO";
import { count } from "console";

class QueueController {
    private dao: QueueDAO;
    private serviceDAO: ServiceDAO;
    private ticketDAO: TicketDAO;

    constructor() {
        this.dao = new QueueDAO();
        this.serviceDAO = new ServiceDAO();
        this.ticketDAO = new TicketDAO();
    }

    async getQueue(serviceId: number, date: Date): Promise<Queue> {
        return this.dao.getQueue(serviceId, date);
    }

    async getAllQueues(): Promise<Queue[]> {
        return this.dao.getAllQueues();
    }

    async addQueue(serviceId: number, date: Date): Promise<void> {
        return this.dao.addQueue(serviceId, date);
    }

    async addCustomerToQueue(serviceId: number, date: Date): Promise<Queue> {
        return this.dao.addCustomerToQueue(serviceId, date);
    }

    async deleteQueue(serviceId: number, date: Date): Promise<void> {
        return this.dao.deleteQueue(serviceId, date);
    }

    async deleteAllQueues(): Promise<void> {
        return this.dao.deleteAllQueues();
    }

    //---------- Task: Implement next customer logic --------//

    /**
     * Calls the next ticket for a given counter by processing the queues associated with it.
     *
     * @param counterId - The ID of the counter for which to call the next ticket.
     * @returns A Promise that resolves to the next Ticket object if one is available; otherwise, it resolves to null.
     * @throws An error if any of the operations (retrieving queues, finding the longest queue, or updating the ticket) fail.
    */
    async callNextTicket(counterId: number): Promise<Ticket> {
        // 1. Get all queues for the counter
        const queues = await this.dao.getQueuesForCounter(counterId);
    
        // 2. Find the longest queue
        const longestQueue = await this.findLongestQueue(queues);
    
        if (!longestQueue) {
            return null; // No ticket to call
        }
    
        // 3. Find the ticket to call, based on length and service time
        const nextTicket = await this.selectNextTicket(longestQueue);
    
        // 4. Update the ticket information
        await this.ticketDAO.markTicketIssued(nextTicket.id, counterId);

        const nt = await this.ticketDAO.getTicket(nextTicket.id);
    
        // 5. Remove the ticket from the queue (decrementing its length)
        await this.dao.removeTicketFromQueue(longestQueue.serviceId);
    
        // 6. Return the selected ticket
        return nt;
    }
    
    /**
     * Finds the longest queue from a given array of queues.
     * If multiple queues have the same length, selects the one with the lowest service time.
     *
     * @param queues - An array of Queue objects to be evaluated.
     * @returns A Promise that resolves to the longest Queue object, or undefined if no queues are found.
     * @throws An error if any operations (like retrieving services) fail.
    */
    async findLongestQueue(queues: Queue[]): Promise<Queue | undefined> {
        if (queues.length === 0) return undefined; // Return undefined if the array is empty
    
        let temp_length = 0;
        const queues_temp: Queue[] = [];
        let longestQueue: Queue | undefined;
    
        for (const queue of queues) {
            if (queue.length > temp_length) { // If the queue is longer
                queues_temp.length = 0; // Clear queues_temp
                queues_temp.push(queue); // Add the new queue
                temp_length = queue.length;
            } else if (queue.length > 0 && queue.length === temp_length) { // If the queue has the same length
                queues_temp.push(queue);
            }
        }
    
        // If there is only 1 queue, return that one
        if (queues_temp.length === 1) {
            return queues_temp[0];
        }
    
        // If there are multiple queues with the same length, select the one with the lowest service time
        const allServices = await this.serviceDAO.getServices();
        let estimated_time: number | undefined;
    
        for (const q of queues_temp) {
            for (const s of allServices) {
                if (s.id == q.serviceId) {
                    if (estimated_time === undefined || s.serviceTime < estimated_time) {
                        longestQueue = q;
                        estimated_time = s.serviceTime; // Use "<" for the lowest service time
                    }
                    break; // Exit the loop once the corresponding service is found
                }
            }
        }
    
        return longestQueue; // Return the longest queue or undefined if not found
    }

    /**
     * Selects the next ticket from a specific queue based on the position in the queue.
     *
     * @param queue - The Queue object from which to select the next ticket.
     * @returns A Promise that resolves to the next Ticket object in the queue.
     * @throws An error if the retrieval of tickets from the DAO fails.
    */
    async selectNextTicket(queue: Queue): Promise<Ticket> {
        // Logic to select the first ticket in a specific queue
        const tickets = await this.ticketDAO.getTicketsByService(queue.serviceId);
    
        let nextTicket = tickets.pop();
        let position_queue: number = nextTicket.queuePosition;
    
        for (const ticket of tickets) {
            if (position_queue === undefined || ticket.queuePosition < position_queue) {
                nextTicket = ticket;
                position_queue = ticket.queuePosition;
            }
        }
    
        return nextTicket;
    }

    /**
     * This method clears all items in the queue and prepares it for fresh input. 
     * It does not return any value and is asynchronous, 
     * which means it returns a Promise that resolves when the operation is complete.
     * 
     * @returns A Promise that resolves when the queue has been reset.
    */
    async resetQueues(): Promise<void> {
        return this.dao.resetQueues();
    }
    
}

export default QueueController;