import DynamoSlack from "../../../modules/services/databases/dynamo/dynamo.slack";
import BadRequest from "../../../modules/classes/errors/request/bad.request";

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
