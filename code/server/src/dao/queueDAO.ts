import db from "../db/db";
import {Queue} from "../components/queue";
import Utilities from "../utilities";

class QueueDAO {
    getQueue(serviceId: number, date: Date): Promise<Queue> {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM queue WHERE serviceId = ? AND date = ?";
            db.get(sql, [serviceId, Utilities.getFormattedDate(date)], (err, row: Queue) => {
                if (err) return reject(err);
                if (row == undefined) return reject("1. No queue found for specified service and date");

                return resolve(row);
            })
        })
    }

    getAllQueues(): Promise<Queue[]> {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM queue"
            db.all(sql, (err, rows: Queue[]) => {
                if (err) return reject(err);
                if (rows === undefined) return reject("No queues found");

                return resolve(rows);
            })
        })
    }

    addQueue(serviceId: number, date: Date): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO queue VALUES(?, ?, 0)"
            db.run(sql, [serviceId, Utilities.getFormattedDate(date)], function(err){
                if(err) return reject(err);

                return resolve();
            })
        })
    }

    addCustomerToQueue(serviceId: number, date: Date): Promise<Queue> {
        return new Promise(async (resolve, reject) => {
            await new Promise<void>((resolve, reject) => {
                const sql = "UPDATE queue SET length = length + 1 WHERE serviceId = ? AND date = ?";
                db.run(sql, [length, serviceId, Utilities.getFormattedDate(date)], function(err){
                    if (err) return reject(err);

                    return resolve();
                })
            })

            const sql = "SELECT * FROM queue WHERE serviceId = ? AND date = ?"
            db.get(sql, [serviceId, Utilities.getFormattedDate(date)], (err: Error | null, row: Queue) => {
                if(err) return reject(err);
                if (row == undefined) return reject("No queue found with specified serviceId for specified date");

                return resolve(row);
            })
        })
    }

    deleteQueue(serviceId: number, date: Date): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM queue WHERE serviceId = ? AND date = ?";
            db.run(sql, [serviceId, Utilities.getFormattedDate(date)], (err) => {
                if (err) return reject(err);

                return resolve();
            })
        })
    }

    deleteAllQueues(): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM queue";
            db.run(sql, (err) => {
                if (err) return reject(err);

                return resolve();
            })
        })
    }

    /**
     * @param counterId The ID of the counter to return the various queues it can serve
     * @returns A Promise of an array of Queue objects
     */
    getQueuesForCounter(counterId: number): Promise<Queue[]> {
        return new Promise<Queue[]>((resolve, reject) => {
            const date = Utilities.getFormattedDate();
            const sql: string = `SELECT queue.serviceId, queue.date, queue.length
                                FROM counter_service, queue
                                WHERE counter_service.counterId = ? AND counter_service.date = ?
                                    AND queue.serviceId = counter_service.serviceId`;
            db.all(sql, [counterId, date], (err, rows: Queue[]) => {
                if(err) return reject(err);

                //const queues = rows.map((q: any) => new Queue(q.serviceId, q.date, q.length));
                return resolve(rows);
            });
        });
    }

    /**
     * Removes a ticket from the queue based on the provided service ID.
     *
     * @param serviceId - The ID of the service for which the ticket should be removed from the queue.
     * @returns A Promise that resolves to void if the operation is successful.
     * @throws An error if the update operation fails or if no rows were affected.
     */
    removeTicketFromQueue(serviceId: number): Promise<void> {
        const date = Utilities.getFormattedDate();
        return new Promise<void>((resolve, reject) => {
            const sql = `UPDATE queue SET length = length - 1 WHERE serviceId = ? AND date = ?`;
            db.run(sql, [serviceId, date], function(this: any, err: Error | null){
                if(err) return reject(err);
                if(this.changes === 0) return reject(new Error("Update not correct."));

                return resolve();
            });
        });
    }

    /**
     * Resets the length of the queue to zero and updates the date.
     *
     * @returns A Promise that resolves to void if the operation is successful.
     * @throws An error if the reset operation fails or if no rows were affected.
     */
    resetQueues(): Promise<void>{
        const date = Utilities.getFormattedDate();
        return new Promise<void>((resolve, reject) => {
            const sql = `UPDATE queue SET length = 0, date = ?`;
            db.run(sql, [date], function(this: any, err: Error | null){
                if(err) return reject(err);
                if(this.changes === 0) return reject(new Error("Reset not correct."));

                return resolve();
            });
        });
    }
}

export default QueueDAO;

























