const {BeforeCrudTunnels} = require("./eventhandlers/before.crud.tunnels");
const {BaseApplication} = require("../../modules/classes/base/base.application");

class BeamMeUpApplication extends BaseApplication {

    /**@return Array*/
    getEventHandlers() {
        return [BeforeCrudTunnels];
    }
}
