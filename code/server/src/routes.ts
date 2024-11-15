import express from "express"
import ErrorHandler from "./helper"
import CounterRoutes from "./routers/counterRoutes"
import ServiceRoutes from "./routers/serviceRoutes"
import TicketRoutes from "./routers/ticketRoutes";
import QueueRoutes from "./routers/queueRoutes";

const morgan = require("morgan")
const prefix = "/officequeue"

/**
 * Initializes the routes for the application.
 * 
 * @remarks
 * This function sets up the routes for the application.
 * It defines the routes for the user, authentication, product, and cart resources.
 * 
 * @param {express.Application} app - The express application instance.
 */
function initRoutes(app: express.Application) {
    app.use(morgan("dev")) // Log requests to the console
    app.use(express.json({ limit: "25mb" }))
    app.use(express.urlencoded({ limit: '25mb', extended: true }))

    /**
     * The authenticator object is used to authenticate users.
     * It is used to protect the routes by requiring users to be logged in.
     * It is also used to protect routes by requiring users to have the correct role.
     * All routes must have the authenticator object in order to work properly.
     */

    const counterRoutes = new CounterRoutes();
    const serviceRoutes = new ServiceRoutes();
    const queueRoutes = new QueueRoutes();
    const ticketRoutes = new TicketRoutes();

    /**
     * The routes for the counter, service and ticket resources are defined here.
    */

    app.use(`${prefix}/counters`, counterRoutes.getRouter())
    app.use(`${prefix}/services`, serviceRoutes.getRouter())
    app.use(`${prefix}/queues`, queueRoutes.getRouter())
    app.use(`${prefix}/tickets`, ticketRoutes.getRouter())

    ErrorHandler.registerErrorHandler(app)
}

export default initRoutes