import {TunnelMeta} from "../classes/pojos/tunnel.meta";
import {HttpRequestTunnel} from "../classes/stream/http.request.tunnel";
import {Logger} from "../../../modules/services/logging/Logger";
import {TcpOutChannel} from "../servers/channels/tcp.out.channel";

const uuidV4 = require('uuid').v4;
const logger = Logger.getLogger('beammeup.TunnelService');

export class TunnelService {
    static _instance = new TunnelService();
    protected connectedTunnels = {};

    static instance(): TunnelService {
        return this._instance;
    }

    isTunnelAliasAvailable(alias: string): boolean {
        return !this.connectedTunnels[alias];
    }

    async createTunnel(connection, tunnelMeta: TunnelMeta) {
        if (!this.isTunnelAliasAvailable(tunnelMeta.alias)) {
            connection.write(JSON.stringify({
                type: 'tunnel.error',
                message: 'Tunnel not available ' + tunnelMeta.alias
            }));
        }
        logger.debug('Creating tunnel for connection ' + connection.id + ' with meta ' + JSON.stringify(tunnelMeta));
        const tunnelId = uuidV4();
        connection.tunnelMeta = Object.assign(tunnelMeta, {id: tunnelId});
        this.connectedTunnels[tunnelMeta.alias] = connection;
        TcpOutChannel.getInstance('/tunnels/' + tunnelMeta.alias + '/http/request/out').subscribe(connection.id);
        connection.write(JSON.stringify({
            type: 'tunnel.success',
            message: 'Tunnel Established'
        }));
    }

    async destroyTunnel(tunnelMeta: TunnelMeta) {
        delete this.connectedTunnels[tunnelMeta.alias];
    }

    async tunnelHttpRequest(tunnelAlias: string, req, res, path: string) {
        const httpRequestTunnel = new HttpRequestTunnel(tunnelAlias, req, res, path);
        await httpRequestTunnel.tunnel();
    }
}
