const DynamoSlack = require("../dynamo/DynamoSlack");
const {RequestContext} = require("../../request/request.context");
const {Models} = require("../../models");
const {System} = require("../system/system.service");
const AWS = require('aws-sdk');
const WebSocketServer = require("ws");
const {AwsProvider} = require("../providers/aws.provider");
const {WebsocketServer} = require("../../websocket/websocket.server");
const {WebsocketResponse} = require("../../models/websocket.response");

class WebsocketService {

    static instance = new WebsocketService();

    /**
     * @param channelName string
     * @param response WebsocketResponse
     */
    async publish(channelName, response) {
        const subscriptions = await new DynamoSlack(Models.BEAMMEUP_WS_SUBSCRIPTIONS).findAll({
            where: {channel_name: channelName},
        });
        const connectionIds = subscriptions.map(subs => subs.connection_id);
        return await this.bulkSendMessage(connectionIds, response.serialize({channelName}));
    }

    /**
     * @param connectionId string
     * @param response WebsocketResponse
     */
    async sendResponse(connectionId, response) {
        return await this.sendMessage(connectionId, response.serialize({connectionId}));
    }

    async sendMessage(connectionId, message, options = {}) {
        if (System.isRunningInLambda()) {
            const apigwManagementApi = AwsProvider.getInstance().getApiGatewayManagementApi();
            await this.sendMessageToApiGateway(apigwManagementApi, connectionId, message, options);
        } else {
            await this.sendMessageToLocal(connectionId, message, options);
        }
    }

    async bulkSendMessage(connectionIds, message, options = {}) {
        if (System.isRunningInLambda()) {
            const apigwManagementApi = AwsProvider.getInstance().getApiGatewayManagementApi();
            return await Promise.all(connectionIds.map((connectionId) => this.sendMessageToApiGateway(apigwManagementApi, connectionId, message, options)));
        }
        return await Promise.all(connectionIds.map((connectionId) => this.sendMessageToLocal(connectionId, message, options)));
    }

    async sendMessageToApiGateway(apigwManagementApi, connectionId, message, options = {}) {
        try {
            await apigwManagementApi.postToConnection({ConnectionId: connectionId, Data: message}).promise();
        } catch (e) {
            if (e.statusCode === 410) {
                console.log(`Found stale connection, deleting ${connectionId}`);
                await new DynamoSlack(Models.BEAMMEUP_CONNECTIONS).destroy({id: connectionId});
            } else {
                throw e;
            }
        }
    }

    async sendMessageToLocal(connectionId, message, options = {}) {
        await WebsocketServer.getInstance().sendMessage(connectionId, message, options);
    }

}

module.exports = {WebsocketService};
