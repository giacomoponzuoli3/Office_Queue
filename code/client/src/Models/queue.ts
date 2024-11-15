// Represents a queue.
class Queue {
    serviceId: number;
    date: Date;
    length: number;

    constructor(serviceId: number, date: Date, length: number) {
        this.serviceId = serviceId;
        this.date = date;
        this.length = length;
    }
}

export { Queue };