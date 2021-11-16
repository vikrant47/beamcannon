import router from '../../routes';
import {TcpTunnelController} from "./controllers/tcp.tunnel.controller";
import {app} from "../../server";
import {routeSubdomainMiddleware} from "./middleware/router.middleware";

const wrap = require('express-async-wrapper');
const tunnelController = TcpTunnelController.getInstance();
app.use(routeSubdomainMiddleware);
router.all('/beammeup/tunnels/:tunnelAlias/:path(*)', wrap(tunnelController.onIncomingRequest))
router.all('/beammeup/tunnels/:tunnelAlias', wrap(tunnelController.onIncomingRequest))

