import {TcpServer} from "../servers/tcp.server";
import {TunnelService} from "../services/tunnel.service";
import {Logger} from "../../../modules/services/logging/Logger";
import {TunnelPacket, TunnelProtocol} from "../classes/pojos/tunnel.meta";
import {TcpInChannel} from "../servers/channels/tcp.in.channel";

const logger = Logger.getLogger('beammeup.TcpTunnelController');

export class TcpTunnelController {
    async onData(connection, data) {
        if (!connection.tunnelMeta && typeof data === 'string') {
            const packet = <TunnelPacket>JSON.parse(data);
            if (packet.first_packet === true) {
                await TunnelService.instance().createTunnel(connection, packet.meta);
            }
        } else if (connection.tunnelMeta && connection.tunnelMeta.protocol === TunnelProtocol.HTTP) {
            const packet = <TunnelPacket>JSON.parse(data);
            const httpData = packet.httpData;
            await TcpInChannel
                .getInstance('/http/pending-requests/' + httpData.requestId + '/data')
                .publish(httpData.response);
        }
    }

    register() {
        logger.debug('Listening tcp socket events');
        TcpServer.instance().on('tcp.socket.data', async (connection, data) => {
            await this.onData(connection, data);
        })
    }
}
