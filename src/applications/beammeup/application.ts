import {BeforeCrudTunnels} from "./eventhandlers/before.crud.tunnels";
import {BaseApplication} from "../../modules/classes/base/base.application";

class BeamMeUpApplication extends BaseApplication {

    /**@return Array*/
    getEventHandlers() {
        return [BeforeCrudTunnels];
    }
}
