import {TunnelInPacket, TunnelMeta} from "../classes/pojos/tunnel.meta";
import {HttpRequestTunnel} from "../classes/stream/http.request.tunnel";
import {Logger} from "../../../modules/services/logging/Logger";
import {TcpOutChannel} from "../servers/channels/tcp.out.channel";
import net from "net";
import _ from "lodash";
import {TcpInChannel} from "../servers/channels/tcp.in.channel";

const names: any[] = require("../resources/tunnel.names.json");

const uuidV4 = require('uuid').v4;
const logger = Logger.getLogger('beammeup.TunnelService');

export class TunnelService {
    static _instance = new TunnelService();
    protected connectedTunnels = {};
    protected responseDataBuffer = {};

    static instance(): TunnelService {
        return this._instance;
    }

    isTunnelConnected(alias: string): boolean {
        return this.connectedTunnels[alias];
    }

    isTunnelAliasAvailable(alias: string): boolean {
        return !this.connectedTunnels[alias];
    }

    /**This will generate alias in case alias is not given*/
    protected generateUniqueTunnelName(tunnelMeta: TunnelMeta, retry = 5) {
        if (!tunnelMeta.alias || tunnelMeta.alias.trim().length === 0) {
            const item = names[Math.floor(Math.random() * names.length)];
            const name = (item[Math.random() * 2 < 1 ? 'superhero' : 'alter_ego'])
                .toLowerCase().replace(/[^A-Z0-9]/ig, "_");
            const alias = _.uniqueId(name);
            if (retry > 0 && !this.isTunnelAliasAvailable(alias)) {
                this.generateUniqueTunnelName(tunnelMeta, retry--);
            }
            tunnelMeta.alias = alias;
        }
    }

    /**
     * Create new tunnel using given alias
     * Check if tunnel alias is given if not , generate new name
     * Check if tunnel with same domain exists or not
     *
     * */
    async createTunnel(connection: net.Socket, tunnelMeta: TunnelMeta) {
        this.generateUniqueTunnelName(tunnelMeta);
        if (!this.isTunnelAliasAvailable(tunnelMeta.alias)) {
            connection.write(JSON.stringify({
                type: 'tunnel.error',
                message: 'Tunnel not available ' + tunnelMeta.alias
            }));
        }
        logger.debug('Creating tunnel for connection ' + connection['id'] + ' with meta ' + JSON.stringify(tunnelMeta));
        const tunnelId = uuidV4();
        connection['tunnelMeta'] = Object.assign(tunnelMeta, {id: tunnelId});
        this.connectedTunnels[tunnelMeta.alias] = connection;
        TcpOutChannel.getInstance('/tunnels/' + tunnelMeta.alias + '/http/request/out').subscribe(connection['id']);
        connection.write(JSON.stringify({
            type: 'tunnel.success',
            message: 'Tunnel Established',
            meta: tunnelMeta,
        }));
    }

    async destroyTunnel(tunnelMeta: TunnelMeta) {
        delete this.connectedTunnels[tunnelMeta.alias];
    }

    async tunnelHttpRequest(tunnelAlias: string, req, res, path = '') {
        const httpRequestTunnel = new HttpRequestTunnel(tunnelAlias, req, res, path);
        await httpRequestTunnel.tunnel();
    }

    publishOnTunnel(tunnelAlias: string, payload: any) {
        this.connectedTunnels[tunnelAlias].write(payload);
    }

    async handleHttpResponse(connection, data) {
        const stringData: string = data.toString('utf-8');
        try {
            connection.firstPacket = <TunnelInPacket>JSON.parse(stringData);
            connection.response = '';
        } catch (e) {
            const lastByteIndex = stringData.indexOf('$$$LAST_BYTE_');
            if (lastByteIndex >= 0) {
                connection.response += stringData.substring(0, lastByteIndex);
                const httpData = JSON.parse(connection.response);
                HttpRequestTunnel.getPendingRequest(httpData.requestId).resolveResponse(httpData.response);
                connection.response = '';
                connection.firstPacket = null;
            }
            connection.response += stringData;
        }
    }
}
