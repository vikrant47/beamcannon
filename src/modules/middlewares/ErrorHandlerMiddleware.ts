import {ApplicationError} from "../classes/errors";

export default {
    async errorHandler(error, req, res, next) {
        if (error instanceof ApplicationError) {
            res.status(error.getStatusCode()).json({
                message: error.getMessage()
            });
        } else {
            res.status(500).json({
                message: error.message,
            });
        }
        next();
    },
}
