import {Logger} from "./Logger";

export interface Loggable {

    debug(message: string, ...meta);

    log(message: string, ...meta);

    info(message: string, ...meta);

    warn(message: string);

    error(message: string, ...meta);

    http(message: string, ...meta);

    verbose(message: string, ...meta);

    silly(message: string, ...meta);
}
