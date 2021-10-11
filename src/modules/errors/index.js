class ApplicationError extends Error {
    constructor(statusCode = 500, message = 'internal server error') {
        super(message);
        this.statusCode = statusCode;
    }

    getStatusCode() {
        return this.statusCode;
    }

    getMessage() {
        return this.message;
    }
}

module.exports = ApplicationError;
