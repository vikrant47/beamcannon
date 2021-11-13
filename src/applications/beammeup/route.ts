import router from '../../routes';
import {TcpTunnelController} from "./controllers/tcp.tunnel.controller";

const wrap = require('express-async-wrapper');
const tunnelController = TcpTunnelController.getInstance();
router.all('/beammeup/tunnels/:tunnelAlias/:path(*)', wrap(tunnelController.onIncomingRequest))
router.all('/beammeup/tunnels/:tunnelAlias', wrap(tunnelController.onIncomingRequest))

