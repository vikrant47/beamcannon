const ApplicationError = require("../errors");

module.exports = {
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
