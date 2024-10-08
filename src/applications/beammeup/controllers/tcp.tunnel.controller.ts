import {TcpServer} from "../servers/tcp.server";
import {TunnelService} from "../services/tunnel.service";
import {Logger} from "../../../modules/services/logging/Logger";
import {TunnelInPacket, TunnelProtocol} from "../classes/pojos/tunnel.meta";
import {TcpInChannel} from "../servers/channels/tcp.in.channel";
import router from "../../../routes";

const logger = Logger.getLogger('beammeup.TcpTunnelController');

export class TcpTunnelController {
    protected static _instance = new TcpTunnelController();

    static getInstance(): TcpTunnelController {
        return this._instance;
    }

    async onIncomingRequest(req, res) {
        const {tunnelAlias, path} = req.params;
        await TunnelService.instance().tunnelHttpRequest(tunnelAlias, req, res, path);
    }

    async onData(connection, data) {
        if (!connection.tunnelMeta) {
            const packet = <TunnelInPacket>JSON.parse(data.toString('utf-8'));
            if (packet.first_packet === true) {
                await TunnelService.instance().createTunnel(connection, packet.meta);
            }
        } else if (connection.tunnelMeta && connection.tunnelMeta.protocol === TunnelProtocol.HTTP) {
           await TunnelService.instance().handleHttpResponse(connection, data);
        }
    }

    async onClose(connection) {
        await TunnelService.instance().destroyTunnel(connection.tunnelMeta);
    }

    register() {
        logger.debug('Listening tcp socket events');
        TcpServer.instance().on('tcp.socket.data', async (connection, data) => {
            await this.onData(connection, data);
        });
        TcpServer.instance().on('tcp.socket.close', async (connection) => {
            await this.onClose(connection);
        });
    }
}
