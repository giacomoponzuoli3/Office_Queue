import express, { Router } from "express"
import ErrorHandler from "../helper"
import {body, param} from "express-validator"
import QueueController from "../controllers/queueController";
import {Queue} from "../components/queue";
import { Ticket } from "../components/ticket";

/**
 * Represents a class that defines the routes for handling proposals.
 */
class QueueRoutes {
    private controller: QueueController
    private readonly router: Router
    private errorHandler: ErrorHandler

    /**
     * Constructs a new instance of the ItemRoutes class.
     */
    constructor() {
        this.controller = new QueueController()
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
         * Retrieves a queue given the serviceId and the date.
         * @returns The queue's information.
         */
        this.router.get(
            "/:serviceId/:date",
            param("serviceId").notEmpty().isNumeric(),
            param("date").notEmpty().isString(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    this.controller.getQueue(req.params.serviceId, new Date(req.params.date)).then(
                        (queue: Queue) => res.status(200).json(queue)
                    )
                } catch (err) {
                    next(err);
                }
            }
        )

        /**
         * Adds a queue to the database
         */
        this.router.post(
            "/",
            body("serviceId").notEmpty().isNumeric(),
            body("date").notEmpty().isString(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    this.controller.addQueue(req.body.serviceId, new Date(req.body.date)).then(
                        () => res.status(200)
                    )
                } catch (err) {
                    next(err);
                }
            }
        )
        
        /**
         * Edits a queue's information.
         */
        this.router.patch(
            ":serviceId/:date",
            param("serviceId").notEmpty().isNumeric(),
            param("date").notEmpty().isString(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    this.controller.addCustomerToQueue(req.params.serviceId, new Date(req.params.date)).then(
                        (queue: Queue) => res.status(200).json(queue)
                    )
                } catch (err) {
                    next(err);
                }
            }
        )

        /**
         * Removes a queue from the database.
         */
        this.router.delete(
            "/:serviceId/:date",
            param("serviceId").notEmpty().isNumeric(),
            param("date").notEmpty().isString(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    this.controller.deleteQueue(req.params.serviceId, new Date(req.params.date)).then(
                        () => res.status(200)
                    )
                } catch (err) {
                    next(err);
                }
            }
        )

        /**
         * Removes all queues from the database.
         */
        this.router.delete(
            "/",
            this.errorHandler.validateRequest,
            (_: any, res: any, next: any) => {
                try {
                    this.controller.deleteAllQueues().then(
                        () => res.status(200)
                    )
                } catch (err) {
                    next(err);
                }
            }
        )

        /**
         * Route to call the next ticket for a specific counter.
         * 
         * @route POST /:counterId
         * @param {number} counterId - The ID of the counter from which to call the next ticket.
         * @returns {Ticket} 200 - The next Ticket object for the counter.
         * @throws {Error} 500 - If there is an issue calling the next ticket.
         * 
         * @middleware param("counterId").isInt() - Middleware to validate that counterId is an integer.
         * @middleware this.errorHandler.validateRequest - Middleware to validate the request and handle errors.
        */
        this.router.patch(
            "/next/:counterId",
            param("counterId").isInt(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    this.controller.callNextTicket(req.params.counterId).then(
                        (ticket: Ticket) => res.status(200).json(ticket)
                    )
                } catch (err) {
                    next(err);
                }
            }
        )
        
        /**
         * Route to reset the queue for all service types.
         * 
         * @route POST /reset
         * @returns {void} 200 - Successfully resets the queue.
         * @throws {Error} 500 - If there is an issue resetting the queue.
         * 
         * This route does not require any parameters and will call the `resetQueue` method 
         * from the controller to clear all queue lengths and reset the date.
        */
        this.router.patch(
            "/reset",
            (_: any, res: any, next: any) => {
                try {
                    this.controller.resetQueues().then(
                        () => res.status(200).send()
                    )
                } catch (err) {
                    console.log(err)
                    next(err);
                }
            }
        )

    }
}

export default QueueRoutes