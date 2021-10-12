const ApplicationError = require("./index");

class BadRequest extends ApplicationError {
    constructor(message) {
        super(400, message);
    }
}

export default BadRequest;
