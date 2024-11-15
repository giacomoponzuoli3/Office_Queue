/**
 * Represents a queue for a service
 */
class Ticket {
    id: number;
    serviceId: number;
    counterId: number;
    queuePosition: number;
    issueDate: Date;
    served: boolean;

    constructor(id: number = 0, serviceId: number = 0, counterId: number = 0, queuePosition: number = 0, issueDate: Date = new Date(), served: boolean = false) {
        this.id = id;
        this.serviceId = serviceId;
        this.counterId = counterId;
        this.issueDate = issueDate;
        this.queuePosition = queuePosition;
        this.served = served;
    }
}

export { Ticket }