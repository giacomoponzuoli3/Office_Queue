/**
 * Represents a ticket
 */
class Ticket {
    id: number;
    serviceId: number;
    counterId: number;
    queuePosition: number;
    issueDate: Date;
    served: boolean;

    constructor(id: number, serviceId: number, counterId: number, queuePosition: number, issueDate: Date, served: boolean) {
        this.id = id;
        this.serviceId = serviceId;
        this.counterId = counterId;
        this.queuePosition = queuePosition;
        this.issueDate = issueDate;
        this.served = served;
    }
}

export { Ticket }