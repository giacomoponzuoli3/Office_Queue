/**
 * Represents a counter
 */
class Counter {
    id: number;
    name: string;

    constructor(id: number = -1, name: string = "") {
        this.id = id;
        this.name = name;
    }
}

export { Counter }