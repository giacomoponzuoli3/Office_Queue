"use strict";

import db from "../db/db";

/**
 * Deletes all data from the database within a transaction.
 * Ensures that all tables are cleaned in the correct order.
 * This function must be called before each integration test.
 */


export async function cleanup() {
    return new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            db.run("BEGIN TRANSACTION", (err: any) => {
                if (err) return reject(new Error("Failed to start transaction: " + err.message));

                db.run("DELETE FROM ticket", (err: any) => {
                    if (err) return reject(new Error("Failed to delete from ticket: " + err.message));

                    db.run("DELETE FROM queue", (err: any) => {
                        if (err) return reject(new Error("Failed to delete from queue: " + err.message));

                        db.run("DELETE FROM counter_service", (err: any) => {
                            if (err) return reject(new Error("Failed to delete from counter_service: " + err.message));

                            db.run("DELETE FROM counter", (err: any) => {
                                if (err) return reject(new Error("Failed to delete from counter: " + err.message));

                                db.run("DELETE FROM service", (err: any) => {
                                    if (err) return reject(new Error("Failed to delete from service: " + err.message));

                                    db.run("COMMIT", (err: any) => {
                                        if (err) return reject(new Error("Failed to commit transaction: " + err.message));
                                        resolve();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}
