import {TunnelMeta} from "../classes/pojos/tunnel.meta";
import {HttpRequestTunnel} from "../classes/stream/http.request.tunnel";
import {Logger} from "../../../modules/services/logging/Logger";

const uuidV4 = require('uuid').v4;
const logger = Logger.getLogger('beammeup.TunnelService');

export class TunnelService {
    static _instance = new TunnelService();
    protected connectedTunnels = {};

    static instance(): TunnelService {
        return this._instance;
    }

    async isTunnelAliasAvailable(alias: string) {
        return !this.connectedTunnels[alias];
    }

    async createTunnel(connection, tunnelMeta: TunnelMeta) {
        logger.debug('Creating tunnel for connection ' + connection.id + ' with meta ' + JSON.stringify(tunnelMeta));
        const tunnelId = uuidV4();
        connection.tunnelMeta = Object.assign(tunnelMeta, {id: tunnelId});
        this.connectedTunnels[tunnelMeta.alias] = connection;
    }

    async destroyTunnel(tunnelMeta: TunnelMeta) {
        delete this.connectedTunnels[tunnelMeta.alias];
    }

    async tunnelHttpRequest(tunnelAlias: string, req, res, path: string) {
        const httpRequestTunnel = new HttpRequestTunnel(tunnelAlias, req, res, path);
        await httpRequestTunnel.tunnel();
    }
}
