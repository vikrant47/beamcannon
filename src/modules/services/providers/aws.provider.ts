import {RequestContext} from "../../classes/request/request.context";

const AWS = require('aws-sdk');

class AwsProvider {
    static instance = new AwsProvider();

    /**@return AwsProvider*/
    static getInstance(): AwsProvider {
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

export {AwsProvider}
