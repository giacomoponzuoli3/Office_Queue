import db from "../db/db";
import {Counter} from "../components/counter";
import { Service } from "../components/service";
import { rejects } from "assert";
import { resolve } from "path";
import { get } from "http";
import Utilities from "../utilities";

class CounterDAO {
    
    getCounter(id: number): Promise<Counter> {
        return new Promise<Counter>((resolve, reject) => {
            const sql = "SELECT * FROM counter WHERE id = ?";
            db.get<any>(sql, [id], (err, row) => {
                if(err){
                    return reject(err);
                }
                if(row === undefined){
                    return reject("Counter not found.");
                }else{
                    return resolve(new Counter(row.id, row.name));
                }
            });
        });
    }

    getAllCounters(): Promise<Counter[]> {
        return new Promise<Counter[]>((resolve, reject) => {
            const sql = "SELECT * FROM counter";
            db.all(sql, [], (err, rows) => {
                if(err){
                    return reject(err);
                }
                const counters = rows.map((r: any) => new Counter(r.id, r.name));
                return resolve(counters);
            });
        });
    }

    deleteCounter(id: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "DELETE FROM counter WHERE id = ?";
            db.run(sql, [id], function(this: any, err: Error | null){
                if(err){
                    return reject(err);
                }
                if(this.changes !== 0){
                    return resolve();
                }
                return reject("Counter not found.");
            });
        });
    }

    addCounter(name: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "INSERT INTO counter(name) VALUES(?)";
            db.run(sql, [name], function(this: any, err: Error | null){
                if(err){
                    return reject(err);
                }
                if(this.lastID == 0){
                    reject("Insertion not completed correctly.");
                }else{
                    resolve();
                }
            });
        });
    }

    editCounter(id: number, name: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "UPDATE counter SET name = ? WHERE id = ?";

            db.run(sql, [name, id], function(this: any, err: Error | null){
                if(err){
                    return reject(err);
                }
                
                if(this.changes !== 0){
                    return resolve();
                }else{
                    return reject("Update not completed correctly.");
                }
            });
        });
    }

    addCounterService(counterId: number, serviceId: number): Promise<void> {
        return new Promise<void> ((resolve, reject) => {
            const date = Utilities.getFormattedDate();

            const sql = `INSERT INTO counter_service(counterId, serviceId, date) VALUES(?, ?, ?)`;

            db.run(sql, [counterId, serviceId, date], function(this: any, err: Error | null){
                if(err){
                    return reject(err);
                }
                if(this.lastID === 0){
                    return reject("Insertion not completed correctly.");
                }else{
                    return resolve();
                }

            });
        });
    }

    deleteCounterService(counterId: number, serviceId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const date = Utilities.getFormattedDate();

            const sql = `DELETE FROM counter_service 
                        WHERE counterId = ? AND serviceId = ? AND date = ?`;
            db.run(sql, [counterId, serviceId, date], function(this: any, err: Error | null){
                if(err){
                    return reject(err);
                }
                if(this.changes !== 0){
                    return resolve();
                }
                return reject("Counter and/or service not found.");
            });
        });
    }

    /**
     * Allows you to return all service types that manage a counter based on the counter id and date (today)
     */
    viewAllServicesByCounterToday(counterId: number): Promise<Service[]> {
        return new Promise((resolve, reject) => {
            const date = Utilities.getFormattedDate();

            const sql = `SELECT id, name, serviceTime
                        FROM counter_service, service
                        WHERE counter_service.serviceId = service.id
                            AND counter_service.counterId = ? AND date = ?`;
            db.all(sql, [counterId, date], (err, rows) => {
                if(err){
                    return reject(err);
                }

                const services = rows.map((r: any) => new Service(r.id, r.name, r.serviceTime));
                
                return resolve(services);
            });
        });
    }

}

export default CounterDAO;