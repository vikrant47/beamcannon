const {RequestContext} = require("../../request/request.context");
const AWS = require('aws-sdk');

class AwsProvider {
    static instance = new AwsProvider();

    /**@return AwsProvider*/
    static getInstance() {
        return this.instance;
    }

    getApiGatewayManagementApi() {
        const event = RequestContext.getCurrentContext().getEvent();
        return new AWS.ApiGatewayManagementApi({
            apiVersion: '2018-11-29',
            endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
        });
    }
}

module.exports = {AwsProvider}
