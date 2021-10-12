const DynamoSlack = require("../../../modules/services/dynamo/DynamoSlack");
const BadRequest = require("../../../modules/errors/bad.request");

class BeforeCrudTunnels {
    events = [DynamoSlack.events.validating];

    /**@param event {ModelEvent}
     @param model {DataModel}**/
    handle(event, model) {
        if (model.hasEmptyAttributes('connection_id', 'tunnel_id')) {
            throw new BadRequest('Connect id and tunnel id are mandatory');
        }
    }
}

export {BeforeCrudTunnels};
