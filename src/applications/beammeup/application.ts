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
        TcpServer.instance().start();
        new TcpTunnelController().register();
    }
}

