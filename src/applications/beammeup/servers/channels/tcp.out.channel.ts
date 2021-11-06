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

    publish(payload: any) {
        for (const connId of this.subscriptions) {
            TcpServer.instance().publish(connId, payload);
        }
    }
}
