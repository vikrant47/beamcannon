import {ApplicationError} from "./index";

class WebsocketError extends ApplicationError {
    constructor(message) {
        super(500, message);
    }
}

export {WebsocketError};
