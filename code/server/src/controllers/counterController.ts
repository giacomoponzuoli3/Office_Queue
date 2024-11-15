import CounterDAO from "../dao/counterDAO";
import {Counter} from "../components/counter";
import { Service } from "../components/service";

/**
 * Represents a controller for managing shopping carts.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class CounterController {
    private dao: CounterDAO

    constructor() {
        this.dao = new CounterDAO;
    }

    async getCounter(id: number): Promise<Counter> {
        return this.dao.getCounter(id);
    }

    async getAllCounters(): Promise<Counter[]> {
        return this.dao.getAllCounters();
    }

    async addCounter(name: string): Promise<void> {
        return this.dao.addCounter(name);
    }

    async deleteCounter(id: number): Promise<void> {
        return this.dao.deleteCounter(id);
    }

    async editCounter(id: number, name: string): Promise<void> {
        return this.dao.editCounter(id, name);
    }

    async addCounterService(counterId: number, serviceId: number): Promise<void> {
        return this.dao.addCounterService(counterId, serviceId);
    }

    async deleteCounterService(counterId: number, serviceId: number): Promise<void> {
        return this.dao.deleteCounterService(counterId, serviceId);
    }

    async viewAllServicesByCounterToday(counterId: number): Promise<Service[]> {
        return this.dao.viewAllServicesByCounterToday(counterId);
    } 
}

export default CounterController