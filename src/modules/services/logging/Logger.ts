import winston from "winston";
import {Loggable} from "./Loggable";


export class Logger {

    static logger = winston.createLogger({
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({filename: 'combined.log'})
        ]
    });

    static getLogger(alias = null): Loggable {
        return new NamedLogger(alias);
    }

    static getLevel() {
        return process.env.LOG_LEVEL || 'info';
    }

    static debug(message, ...meta) {
        return this.logger.debug(message, meta);
    }

    static log(message, ...meta) {
        return this.logger.log(this.getLevel(), message, meta);
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

export class NamedLogger implements Loggable {
    constructor(protected name: string) {

    }

    debug(message, ...meta) {
        return Logger.debug(`${this.name} | ${message}`, meta);
    }

    log(message, ...meta) {
        return Logger.log(`${this.name} | ${message}`, meta);
    }

    info(message, ...meta) {
        return Logger.info(`${this.name} | ${message}`, meta);
    }

    warn(message) {
        return Logger.warn(`${this.name} | ${message}`);
    }

    error(message, ...meta) {
        return Logger.error(`${this.name} | ${message}`, meta);
    }

    http(message, ...meta) {
        return Logger.http(`${this.name} | ${message}`, meta);
    }

    verbose(message, ...meta) {
        return Logger.verbose(`${this.name} | ${message}`, meta);
    }

    silly(message, ...meta) {
        return Logger.silly(`${this.name} | ${message}`, meta);
    }
}
