import {FsSlack} from "../../../../modules/services/databases/fs/fs.slack";
import {Models} from "../../models";
import BadRequest from "../../../../modules/classes/errors/request/bad.request";
import {TcpOutChannel} from "../../servers/channels/tcp.out.channel";
import {TcpInChannel} from "../../servers/channels/tcp.in.channel";
import {TunnelService} from "../../services/tunnel.service";

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
    }

    protected addToWaitStack(promise) {
        this.promise = promise;
        HttpRequestTunnel.pendingRequests[this.requestId] = this;
    }

    public async tunnel() {
        if (!TunnelService.instance().isTunnelConnected(this.tunnelAlias)) {
            throw new BadRequest('Tunnel ' + this.tunnelAlias + 'has been disconnected ')
        }
        /*const tunnel = new FsSlack(Models.BEAM_TUNNELS).findOne({where: {alias: this.tunnelAlias}});
        if (!tunnel) {
            throw new BadRequest('No tunnel found with given alias ' + this.tunnelAlias);
        }*/
        try {
            const tunnelRes: any = await new Promise((resolve, reject) => {
                TunnelService.instance().publishOnTunnel(this.tunnelAlias, JSON.stringify({
                    request: {
                        path: this.path,
                        id: this.requestId,
                        headers: this.req.headers,
                        body: this.req.body,
                        url: '/' + this.path + '?' + this.req.query
                    },
                }));
                this.addToWaitStack({resolve, reject});
            });
            this.res.set(tunnelRes.headers || {})
            this.res.end(Buffer.from(tunnelRes.body, 'base64'),'binary');
        } catch (e) {
            this.res.status(500).send(e.message);
            throw e;
        }
    }

    public resolveResponse = (response) => {
        this.promise.resolve(response);
    }
}
