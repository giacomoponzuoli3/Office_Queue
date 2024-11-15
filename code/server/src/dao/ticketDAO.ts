import db from "../db/db";
import {Ticket} from "../components/ticket";
import Utilities from "../utilities";
import any = jasmine.any;
import {Queue} from "../components/queue";

class TicketDAO {
    getTicket(id: number): Promise<Ticket> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ticket WHERE id = ?`;
            db.get(sql, [id], (err, row: Ticket) => {
                if (err) {
                    return reject(err);
                }
                if (row == undefined) {
                    return reject("No queue found with specified serviceId for specified date");
                }
                return resolve(row);
            })
        })
    }

    /**
     * Retrieves all tickets associated with a specific service that have not yet been served.
     *
     * @param serviceId - The ID of the service for which to retrieve tickets.
     * @returns A Promise that resolves to an array of Ticket objects associated with the specified service.
     * @throws An error if the database query fails.
     */
    getTicketsByService(serviceId: number): Promise<Ticket[]> {
        return new Promise<Ticket[]>((resolve, reject) => {
            const sql = "SELECT * FROM ticket WHERE serviceId = ? AND served = 0";
            db.all(sql, [serviceId], (err, rows: Ticket[]) => {
                if(err) return reject(err);

                //const tickets = rows.map((t: any) => new Ticket(t.id, t.position_queue, t.date_issued, t.is_served));
                resolve(rows);
            });
        });
    }

    getAllTickets(): Promise<Ticket[]> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tickets`;
            db.all(sql, (err, rows: Ticket[]) => {
                if (err) return reject(err);
                if (rows === undefined) return reject("No tickets found.");

                return resolve(rows);
            })
        })
    }

    addTicket(serviceId: number, date: Date = null): Promise<void> {
        return new Promise(async (resolve, reject) => {
            // Retrieves the current length of the queue relative to the specified service.
            const queue_length = await new Promise<number>((resolve, reject) => {
                const sql = "SELECT length FROM queue WHERE serviceId = ? AND date = ?";
                db.get(sql, [serviceId, Utilities.getFormattedDate(date)], (err, row: number) => {
                    if (err) return reject(err);
                    if (row == undefined) return reject("No queue found with specified serviceId and date");

                    return resolve(row);
                })
            })

            // Adds a ticket to the database.
            await new Promise<void>((resolve, reject) => {
                const sql: string = "INSERT INTO ticket (serviceId, counterId, queuePosition, dateIssued, served) VALUES (?, -1, ?, ?, false)"
                db.run(sql, [serviceId, queue_length, Utilities.getFormattedDate(date)], function(err: Error | null){
                    if(err) return reject(err);

                    return resolve();
                })
            })

            // Increases the queue length by one
            const sql = "UPDATE queue SET length = length + 1 WHERE serviceId = ? AND date = ?";
            db.run(sql, [serviceId, Utilities.getFormattedDate(date)], (err) => {
                if (err) return reject(err);

                return resolve();
            })
        })
    }

    editTicket(id: number, serviceId: number, counterId: number, position: number, date: Date = null, served: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE ticket SET serviceId = ?,  counterId = ?, queuePosition = ?, issueDate = ?, served = ? WHERE id = ?`;
            db.run(sql, [serviceId, counterId, position, Utilities.getFormattedDate(date), served, id], function(err: Error | null){
                if (err) return reject(err);

                return resolve();
            })
        })
    }

    deleteTicket(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql: string = "DELETE FROM ticket WHERE id = ?";
            db.run(sql, [id], (err: Error | null) => {
                if (err) return reject(err);

                return resolve();
            })
        })
    }

    deleteTickets() {
        return new Promise<void>((resolve, reject) => {
            const sql = `DELETE FROM ticket`;
            db.run(sql, (err: Error | null) => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            })
        })
    }

    getNewTicket(serviceId: number): Promise<Ticket> {
        const date = new Date();

        return new Promise(async (resolve, reject) => {
            // Retrieves the current length of the queue relative to the specified service.
            const queue_length = await new Promise<number>((resolve, reject) => {
                const sql = "SELECT * FROM queue WHERE serviceId = ? AND date = ?";
                db.get(sql, [serviceId, Utilities.getFormattedDate(date)], (err, row: Queue) => {
                    if (err) return reject(err);
                    if (row == undefined) return reject("No queue found with specified serviceId and date");

                    return resolve(row.length);
                })
            })

            // Adds a ticket to the database.
            await new Promise<void>((resolve, reject) => {
                const sql: string = "INSERT INTO ticket (serviceId, counterId, queuePosition, issueDate, served) VALUES (?, null, ?, ?, false)"
                db.run(sql, [serviceId, queue_length, Utilities.getFormattedDate(date)], function(err: Error | null){
                    if(err) return reject(err);

                    return resolve();
                })
            })

            // Increases the queue length by one
            await new Promise<void>((resolve, reject) => {
                const sql = "UPDATE queue SET length = length + 1 WHERE serviceId = ? AND date = ?";
                db.run(sql, [serviceId, Utilities.getFormattedDate(date)], (err) => {
                    if (err) return reject(err);

                    return resolve();
                })
            })

            // Retrieves the newly created ticket's information.
            const sql = "SELECT * FROM ticket WHERE serviceId = ? AND issueDate = ? AND queuePosition = ?";
            db.get(sql, [serviceId, Utilities.getFormattedDate(date), queue_length], (err, row: Ticket) => {
                if (err) return reject(err);

                return resolve(row);
            })
        })
    }

    /**
     * Marks a ticket as issued by updating its status and associating it with a specific counter.
     *
     * @param ticketId - The ID of the ticket to be marked as issued.
     * @param counterId - The ID of the counter that is serving the ticket.
     * @returns A Promise that resolves to void if the operation is successful.
     * @throws An error if the update operation fails or if no rows were affected.
     */
    markTicketIssued(ticketId: number, counterId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const date = Utilities.getFormattedDate();
            const sql = `UPDATE ticket 
                            SET counterId = ?, issueDate = ?, served = 1
                            WHERE id = ?`;
            db.run(sql, [counterId, date, ticketId], function(this: any, err: Error | null){
                if(err) return reject(err);
                if(this.changes === 0) return reject(new Error("Update not correct."));

                return resolve();
            });
        });
    }
}

export default TicketDAO;