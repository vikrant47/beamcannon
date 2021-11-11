import {BaseChannel} from "./base.channel";
import {TcpServer} from "../tcp.server";

export class TcpOutChannel extends BaseChannel<string> {
    static channels = {};

    static getInstance(path: string): TcpOutChannel {
        if (!this.channels[path]) {
            this.channels[path] = new TcpOutChannel(path);
        }
        return this.channels[path];
    }

    static destroy(path: string) {
        delete this.channels[path];
    }

    publish(payload: any, errorOnNoSubs = true) {
        if (this.subscriptions.length === 0 && errorOnNoSubs) {
            throw new Error('No subscriber exists for channel ' + this.path)
        }
        for (const connId of this.subscriptions) {
            TcpServer.instance().publish(connId, payload);
        }
    }
}
