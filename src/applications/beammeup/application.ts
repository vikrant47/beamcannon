import {BeforeCrudTunnels} from "./eventhandlers/before.crud.tunnels";
import {BaseApplication} from "../../modules/classes/base/base.application";
import {TcpServer} from "./servers/tcp.server";
import {TcpTunnelController} from "./controllers/tcp.tunnel.controller";


export class Application extends BaseApplication {

    /**@return Array*/
    getEventHandlers() {
        return [BeforeCrudTunnels];
    }

    bootstrap() {
        // registerModels();
        require('./route');// loading routes
        TcpServer.instance().start();
        TcpTunnelController.getInstance().register();
    }
}

