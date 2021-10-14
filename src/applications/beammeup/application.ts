import {BeforeCrudTunnels} from "./eventhandlers/before.crud.tunnels";
import {BaseApplication} from "../../modules/classes/base/base.application";

export class Application extends BaseApplication {

    /**@return Array*/
    getEventHandlers() {
        return [BeforeCrudTunnels];
    }
}

