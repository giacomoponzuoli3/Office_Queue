import express, { Router } from "express"
import ErrorHandler from "../helper"
import {body, oneOf, param, query} from "express-validator"
import TicketController from "../controllers/ticketController";
import {Ticket} from "../components/ticket";

/**
 * Represents a class that defines the routes for handling proposals.
 */
class TicketRoutes {
    private controller: TicketController
    private readonly router: Router
    private errorHandler: ErrorHandler

    /**
     * Constructs a new instance of the ItemRoutes class.
     */
    constructor() {
        this.controller = new TicketController()
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
         * Retrieves a ticket given its id.
         * @returns The ticket's information.
         */
        this.router.get(
            "/:id",
            param("id").notEmpty().isNumeric(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    this.controller.getTicket(req.params.id).then(
                        (ticket: Ticket) => res.status(200).json(ticket)
                    )
                } catch (err) {
                    next(err);
                }
            }
        )

        /**
         * Retrieves a list of all the tickets in the database.
         * @returns A Ticket[] array.
         */
        this.router.get(
            "/",
            this.errorHandler.validateRequest,
            (_: any, res: any, next: any) => {
                try {
                    this.controller.getTickets().then(
                        (tickets: Ticket[]) => res.status(200).json(tickets)
                    )
                }
                catch (err) {
                    next(err)
                }
            }
        )

        /**
         * Adds a ticket to the database
         */
        this.router.post(
            "/",
            body("serviceId").notEmpty().isNumeric(),
            body("date").notEmpty().isDate(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    this.controller.addTicket(req.body.serviceId, new Date(req.body.date)).then(
                        () => res.status(200)
                    )
                } catch (err) {
                    next(err);
                }
            }
        )

        /**
         * Edits the information of a specific ticket in the database.
         */
        this.router.patch(
            "/:id",
            param("id").notEmpty().isNumeric(),
            body("serviceId").notEmpty().isNumeric(),
            body("counterId").notEmpty().isNumeric(),
            body("position").notEmpty().isNumeric(),
            body("date").notEmpty().isDate(),
            body("served").notEmpty().isBoolean(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    this.controller.editTicket(
                        req.params.id,
                        req.body.serviceId,
                        req.body.counterId,
                        req.body.position,
                        new Date(req.body.date),
                        req.body.served
                    ).then(
                        () => res.status(200)
                    )
                } catch (err) {
                    next(err);
                }
            }
        )

        /**
         * Removes a ticket from the database.
         */
        this.router.delete(
            "/:id",
            param("id").notEmpty().isNumeric(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    this.controller.deleteTicket(req.params.id).then(
                        () => res.status(200)
                    )
                } catch (err) {
                    next(err);
                }
            }
        )

        /**
         * Removes all tickets from the database.
         */
        this.router.delete(
            "/",
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    this.controller.deleteTickets().then(
                        () => res.status(200)
                    )
                } catch (err) {
                    next(err);
                }
            }
        )

        /**
         * Adds a new ticket to the database and retrieves its information.
         * @returns The newly created Ticket item.
         */
        this.router.post(
            "/new",
            body("serviceId").notEmpty().isNumeric(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    this.controller.getNewTicket(req.body.serviceId).then(
                        (ticket: Ticket) => res.status(200).json(ticket)
                    )
                } catch (err) {
                    next(err);
                }
            }
        )

        /**
         * Marks a ticket as served.
         */
        this.router.patch(
            "serve/:id",
            param("id").notEmpty().isNumeric(),
            body("counterId").notEmpty().isNumeric(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    this.controller.markTicketIssued(req.params.id, req.body.counterId).then(
                        () => res.status(200)
                    )
                } catch (err) {
                    next(err);
                }
            }
        )
    }
}

export default TicketRoutes