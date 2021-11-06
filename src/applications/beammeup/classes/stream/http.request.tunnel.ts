import {FsSlack} from "../../../../modules/services/databases/fs/fs.slack";
import {Models} from "../../models";
import BadRequest from "../../../../modules/classes/errors/request/bad.request";
import {TcpOutChannel} from "../../servers/channels/tcp.out.channel";
import {TcpInChannel} from "../../servers/channels/tcp.in.channel";

const uuidV4 = require('uuid').v4;

export class HttpRequestTunnel {
    static pendingRequests: { string: HttpRequestTunnel } = <{ string: HttpRequestTunnel }>{};
    protected requestId: string;
    protected promise: any;

    static getPendingRequests() {
        return this.pendingRequests;
    }

    static getPendingRequest(requestId: string): HttpRequestTunnel {
        return this.pendingRequests[requestId];
    }

    public constructor(protected tunnelAlias: string, protected req, protected res, protected path) {
        this.requestId = uuidV4();
        TcpInChannel.getInstance('/http/pending-requests/' + this.requestId + '/data')
            .subscribe(this.resolveResponse);
    }

    protected addToWaitStack(promise) {
        this.promise = promise;
        HttpRequestTunnel.pendingRequests[this.requestId] = this;
    }

    public async tunnel() {
        /*const tunnel = new FsSlack(Models.BEAM_TUNNELS).findOne({where: {alias: this.tunnelAlias}});
        if (!tunnel) {
            throw new BadRequest('No tunnel found with given alias ' + this.tunnelAlias);
        }*/
        try {
            const tunnelRes: any = await new Promise((resolve, reject) => {
                TcpOutChannel.getInstance('/tunnels/' + this.tunnelAlias + '/http/request/out').publish(JSON.stringify({
                    id: this.requestId,
                    request: {
                        headers: this.req.headers,
                        body: this.req.body,
                        url: '/' + this.path + '?' + this.req.query
                    },
                    path: this.path,
                }));
                this.addToWaitStack({resolve, reject});
            });
            this.res.set(tunnelRes.headers || {})
            this.res.send(tunnelRes.body);
        } catch (e) {
            this.res.status(500).send(e.message);
        }
    }

    public resolveResponse = (response) => {
        this.promise.resolve(response);
        TcpInChannel.getInstance('/http/pending-requests/' + this.requestId + '/data').unsubscribe(this.resolveResponse)
    }
}
