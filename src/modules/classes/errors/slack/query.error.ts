import {ApplicationError} from "../index";

export class QueryError extends ApplicationError {
    constructor(message) {
        super(500, message);
    }
}
