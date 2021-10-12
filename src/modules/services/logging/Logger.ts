import winston from "winston";

export class Logger {

    static logger = winston.createLogger({
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({filename: 'combined.log'})
        ]
    });

    static getLevel() {
        return process.env.LOG_LEVEL || 'info';
    }

    static debug(message, ...meta) {
        return this.logger.debug(message, meta);
    }

    static log(message, ...meta) {
        return this.logger.log(this.getLevel(), meta);
    }

    static info(message, ...meta) {
        return this.logger.info(message, meta);
    }

    static warn(message) {
        return this.logger.warn(message);
    }

    static error(message, ...meta) {
        return this.logger.error(message, meta);
    }

    static http(message, ...meta) {
        return this.logger.http(message, meta);
    }

    static verbose(message, ...meta) {
        return this.logger.verbose(message, meta);
    }

    static silly(message, ...meta) {
        return this.logger.silly(message, meta);
    }

}
