const DynamoSlack = require("../services/dynamo/DynamoSlack");
const axios = require('axios');
const UtilService = require('../services/UtilService');

const ProxyController = {
    async trigger(req, res, next) {
        const slack = new DynamoSlack('jira-workspace-instance_properties');
        const {triggerName} = req.params;
        const query = {
            where: {
                '$and': [{
                    instance_id: req.instance
                }, {
                    property: 'web.triggers'
                }]
            }
        }
        const result = await slack.findAll(query);
        const webTriggers = result[0].value ? UtilService.safeParse(result[0].value) : {};
        let response;
        for (const [key, value] of Object.entries(webTriggers)) {
            if (key === triggerName) {
                // https://a19e5c85-68d1-4057-a5d1-e9497093f548.hello.atlassian-dev.net/x1/McbWxEwXwTlOBfmwcQwormlsVqM
                response = await axios({
                    url: value,
                    method: 'POST',
                    data: req.body
                });
            }
        }

        res.send({
            result: 'success',
        });
    }
}
export default ProxyController;
