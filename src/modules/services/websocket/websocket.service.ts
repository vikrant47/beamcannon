const DynamoSlack = require("../dynamo/DynamoSlack");
import {WebsocketResponse} from "../../models/websocket.response";
import {WsResponseTypes} from "../../models/websocket.response";
import {Models} from "../../models";
import {System} from "../system/system.service";
import {AwsProvider} from "../providers/aws.provider";
import {WebsocketServer} from "../../websocket/websocket.server";

class WebsocketService {

    static instance = new WebsocketService();

    async unsubscribe(connectionId, channelName) {
        const result = await new DynamoSlack(Models.BEAMMEUP_WS_SUBSCRIPTIONS).destroy({
            where: {
                channel_name: channelName,
                connection_id: connectionId,
            }
        });
        await this.sendMessage(connectionId, new WebsocketResponse({
            connectionId,
            type: WsResponseTypes.unsubscribe,
            message: 'UnSubscribe successfully',
            channelName: channelName,
            data: result,
        }));
    }

    async subscribe(connectionId, channelName) {
        const result = await new DynamoSlack(Models.BEAMMEUP_WS_SUBSCRIPTIONS).create({
            channel_name: channelName,
            connection_id: connectionId,
        });
        await this.sendMessage(connectionId, new WebsocketResponse({
            connectionId,
            type: WsResponseTypes.subscribe,
            message: 'Subscribed successfully',
            channelName: channelName,
            data: result,
        }));
    }

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
            const apiManagementApi = AwsProvider.getInstance().getApiGatewayManagementApi();
            await this.sendMessageToApiGateway(apiManagementApi, connectionId, message, options);
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

export {WebsocketService};
