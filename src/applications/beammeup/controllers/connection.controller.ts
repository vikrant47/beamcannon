import BadRequest from "../../../modules/classes/errors/request/bad.request";
import UtilService from "../../../modules/services/UtilService";
import {FsSlack} from "../../../modules/services/databases/fs/fs.slack";
import {Models} from "../models";

export const ConnectionController = {
    async subscribe(req, res) {
        let {channel, connection_id} = req.params;
        if (!channel) {
            throw new BadRequest('channel not found in params ' + JSON.stringify(req.params));
        }
        if (!connection_id) {
            throw new BadRequest('connection_id not found in params ' + JSON.stringify(req.params));
        }

    }
}
