import express, { Router } from "express"
import ErrorHandler from "../helper"
import {body, oneOf, param, query} from "express-validator"
import CounterController from "../controllers/counterController";
import {Counter} from "../components/counter";
import { Service } from "../components/service";

/**
 * Represents a class that defines the routes for handling proposals.
 */
class CounterRoutes {
    private controller: CounterController
    private readonly router: Router
    private errorHandler: ErrorHandler

    /**
     * Constructs a new instance of the ItemRoutes class.
     */
    constructor() {
        this.controller = new CounterController()
        this.router = express.Router()
        this.errorHandler = new ErrorHandler()
        this.initRoutes()
    }

    /**
     * Returns the router instance.
     * @returns The router instance.
     */
    getRouter(): Router {
        return this.router
    }

    /**
     * Initializes the routes for the product router.
     * 
     * @remarks
     * This method sets up the HTTP routes for handling product-related operations such as registering products, registering arrivals, selling products, retrieving products, and deleting products.
     * It can (and should!) apply authentication, authorization, and validation middlewares to protect the routes.
     * 
     */
    initRoutes() {

        /**
         * Route for registering a new counter in the db.
         * Requires the counter's name in the body, a non-empty string.
         * Returns a 200 status code if the registration was successful.
         */
        this.router.post("/",
            body("name").isString().notEmpty(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.addCounter(req.body.name)
                .then(() => res.status(200).end())
                .catch((err: any) => next(err))
        )

        /**
         * Route for retrieving an counter.
         * Requires the counter's id, a non-empty integer.
         * Returns a 200 status code and the counter's data if the selected counter is present in the database.
         */
        this.router.get(
            "/:id",
            param("id").isInt(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.getCounter(req.params.id)
                .then((counter: Counter) => res.status(200).json(counter))
                .catch((err) => {
                    console.log(err)
                    next(err)
                })
        )

        /**
         * Route for retrieving all counters.
         * It doesn't require anything
         * Returns a 200 status code and the items' data.
         */
        this.router.get(
            "/",
            (req: any, res: any, next: any) => this.controller.getAllCounters()
                .then((counters: Counter[]) => res.status(200).json(counters))
                .catch((err) => {
                    console.log(err)
                    next(err)
                })
        )

        /**
         * Route for update a counter in the db.
         * Requires the counter's id in the param (a non-empty integer) and the counter's name in the body (a non-empty string).
         * Returns a 200 status code if the Update was successful.
         */
        this.router.post("/:id",
            param("id").isInt(),
            body("name").isString().notEmpty(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.editCounter(req.param.id, req.body.name)
                .then(() => res.status(200).end())
                .catch((err: any) => next(err))
        )

        /**
         * Route for delete an counter from db.
         * Requires the counter's id, a non-empty integer.
         * Returns a 200 status code and the counter's data if the selected counter is present in the database.
         */
        this.router.delete(
            "/:id",
            param("id").isInt().notEmpty(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.deleteCounter(req.params.id)
                .then(() => res.status(200).send())
                .catch((err) => {
                    console.log(err)
                    next(err)
                })
        )

        /**
         * Route to add a service at the counter for today
         * Requires the counterId and serviceId
         * Return a 200 status code if the Insertion was successful
         */
        this.router.post(
            "/:counterid/services/:serviceid",
            param("counterid").isInt(),
            param("serviceid").isInt(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.addCounterService(req.params.counterid, req.params.serviceid)
                .then(() => res.status(200).send())
                .catch((err) => {
                    console.log(err)
                    next(err)
                })
        )

        /**
         * Route to delete a service at the counter for today
         * Requires the counterId and serviceId
         * Return a 200 status code if the Delete was successful
         */
        this.router.delete(
            "/:counterid/services/:serviceid",
            param("counterid").isInt(),
            param("serviceid").isInt(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.deleteCounterService(req.params.counterid, req.params.serviceid)
                .then(() => res.status(200).send())
                .catch((err) => {
                    console.log(err)
                    next(err)
                })
        )

        /**
         * Route to view all services that a counter hadles today
         * Requires the counterId 
         * Return a 200 status code and return the list of the services
         */
        this.router.get(
            "/:counterid/services",
            param("counterid").isInt(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.viewAllServicesByCounterToday(req.params.counterid)
                .then((services: Service[]) => res.status(200).json(services))
                .catch((err) => {
                    console.log(err)
                    next(err)
                })
        )
    }
}

export default CounterRoutes