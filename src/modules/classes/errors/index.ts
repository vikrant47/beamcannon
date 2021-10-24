export class ApplicationError extends Error {
    constructor(protected statusCode = 500, message = 'internal server error') {
        super(message);
        this.statusCode = statusCode;
    }

    getStatusCode(): number {
        return this.statusCode;
    }

    getMessage(): string {
        return this.message;
    }
}

