import {BeforeCrudTunnels} from "./eventhandlers/before.crud.tunnels";
import {BaseApplication} from "../../modules/classes/base/base.application";
import {TcpServer} from "./services/tcp.server";

export class Application extends BaseApplication {

    /**@return Array*/
    getEventHandlers() {
        return [BeforeCrudTunnels];
    }

    bootstrap() {
        TcpServer.instance().start();
    }
}

