import express, { Router } from "express"
import ErrorHandler from "../helper"
import {body, param} from "express-validator"
import ServiceController from "../controllers/serviceController";
import {Service} from "../components/service";

/**
 * Represents a class that defines the routes for handling proposals.
*/
class ServiceRoutes {
    private controller: ServiceController
    private readonly router: Router
    private errorHandler: ErrorHandler

    /**
     * Constructs a new instance of the ServiceRoutes class.
    */
    constructor() {
        this.controller = new ServiceController()
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

    initRoutes() {

        /**
         * Route for registering a new service in the db.
        */
        this.router.post(
            "/",
            body("name").isString().isLength({ min: 3 }),
            body("serviceTime").isNumeric(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    this.controller.addService(req.body.name, req.body.serviceTime);
                    res.status(200).end(); 
                } catch (err) {
                    next(err);
                }
            }
        ); 
        
        /**
         * Route for retrieving a specific service.  
        */
        this.router.get(
            "/:id",
            param("id").isNumeric(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    this.controller.getService(req.params.id).then((service: Service) => {
                        res.status(200).json(service);
                    });
                } catch (err) {
                    next(err);
                }
            }
        );

        /**
         * Route for retrieving a specific service by its name.
         */
        this.router.get(
            "/name/:name",
            param("name").isString(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    this.controller.findServiceWithName(req.params.name).then((service: Service) => {
                        res.status(200).json(service);
                    });
                } catch (err) {
                    next(err);
                }
            }
        );

        /**
         * Route for retrieving all services.
        */
        this.router.get(
            "/",
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    this.controller.getServices().then((services: Service[]) => {
                        res.status(200).json(services);
                    });
                } catch (err) {
                    next(err);
                }
            }
        );

        /**
         * Route for deleting a specific service.
        */
        this.router.delete(
            "/:name",
            param("name").isString(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    this.controller.deleteService(req.params.name).then(() => {
                        res.status(200).end();
                    });
                } catch (err) {
                    next(err);
                }
            }
        );

        /**
         * Route for editing a service.
        */
        this.router.patch(
            "/:name",
            param("name").isString(),
            body("newName").isString(),
            body("serviceTime").isNumeric(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    this.controller.editService(req.params.name, req.body.newName, req.body.serviceTime).then(() => {
                        res.status(200).end();
                    });
                } catch (err) {
                    next(err);
                }
            }
        );

        /**
         * Route for estimate waiting time a specific service.  
        */
        this.router.get(
            "/waitingtime/:id",
            param("id").isNumeric(),
            this.errorHandler.validateRequest,
            async (req: any, res: any, next: any) => {
                try {
                    // Await the promise to catch any errors
                    const waitingTime = await this.controller.estimateServiceWaitingTime(req.params.id);
                    res.status(200).json({ waitingTime }); // Return as a JSON object
                } catch (err) {
                    next(err); // Pass the error to the global error handler
                }
            }
        );
    }
}

export default ServiceRoutes
