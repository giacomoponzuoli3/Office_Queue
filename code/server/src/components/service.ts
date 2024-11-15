class Service{
    id: number;
    name: string;
    serviceTime: number;
  
    /**
     * Constructor for the Service class.
     * @param id - The id of the service.
     * @param name - The name of the service.
     * @param serviceTime - The amount of time that the service takes to complete.
     */
    constructor(id: number, name: string = "", serviceTime: number = 0) {
        /* The id of the service */

        this.id = id;

        /* The name of the service */
        this.name = name;
  
        /* The amount of time that the service takes to complete */

        this.serviceTime = serviceTime;
    }
}

export { Service }