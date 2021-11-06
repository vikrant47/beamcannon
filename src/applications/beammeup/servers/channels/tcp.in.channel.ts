import {BaseChannel} from "./base.channel";
import {TcpServer} from "../tcp.server";

export class TcpInChannel extends BaseChannel<Function> {
    static channels = {};

    static getInstance(path: string): TcpInChannel {
        if (!this.channels[path]) {
            this.channels[path] = new TcpInChannel(path);
        }
        return this.channels[path];
    }

    async publish(payload: any) {
        for (const subs of this.subscriptions) {
            await subs.call(this, payload);
        }
    }
}
