"use strict";

import db from "../db/db";

export async function setup() { // Create tables in the database
    return new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS counter
                    (
                       "id" INTEGER NOT NULL UNIQUE,
                       "name" TEXT NOT NULL UNIQUE,
                       PRIMARY KEY("id" AUTOINCREMENT)
                    )`, (err) => {
                if (err) return reject(new Error("Failed to create counter table: " + err.message));
                
                db.run(`CREATE TABLE IF NOT EXISTS service
                        (
                            "id" INTEGER NOT NULL UNIQUE,
                            "name" TEXT NOT NULL UNIQUE,
                            "serviceTime" INTEGER NOT NULL,
                            PRIMARY KEY("id" AUTOINCREMENT)
                        )`, (err) => {
                    if (err) return reject(new Error("Failed to create service table: " + err.message));

                    db.run(`CREATE TABLE IF NOT EXISTS counter_service
                            (
                                "counterId" INTEGER NOT NULL,
                                "serviceId" INTEGER NOT NULL,
                                "date" VARCHAR(20) NOT NULL,
                                FOREIGN KEY("counterId") REFERENCES "counter"("id") ON DELETE CASCADE,
                                FOREIGN KEY("serviceId") REFERENCES "service"("id") ON DELETE CASCADE,
                                PRIMARY KEY(counterId, serviceId, date)
                            )`, (err) => {
                        if (err) return reject(new Error("Failed to create counter_service table: " + err.message));

                        db.run(`CREATE TABLE IF NOT EXISTS queue
                                (
                                    "serviceId" INTEGER NOT NULL,
                                    "date" VARCHAR(20) NOT NULL,
                                    "length" INTEGER NOT NULL,
                                    FOREIGN KEY("serviceId") REFERENCES "service"("id") ON DELETE CASCADE,
                                    PRIMARY KEY(serviceId, date)
                                )`, (err) => {
                            if (err) return reject(new Error("Failed to create queue table: " + err.message));
                            resolve(); // All tables created successfully
                        });
                    });
                });
            });
        });
    });
}