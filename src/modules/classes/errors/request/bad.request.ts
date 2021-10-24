import {ApplicationError} from "../index";

class BadRequest extends ApplicationError {
    constructor(message) {
        super(400, message);
    }
}

export default BadRequest;
