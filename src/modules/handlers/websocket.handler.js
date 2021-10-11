const {BaseHandler} = require("./base.handler");


class WebsocketHandler extends BaseHandler {
    canHandle(event, context) {
        return event.requestContext.connectionId;
    }

    async handle(event, context) {
        const {
            requestContext: {connectionId, routeKey},
        } = event;

        if (routeKey === "$connect") {
            // handle new connection
            await this.onConnect(connectionId);
        } else if (routeKey === "$disconnect") {
            // handle disconnection
            await this.onDisconnect(connectionId);
        }
        await this.onMessage(connectionId);
        // $default handler
        return {
            statusCode: 200
        }
    }

    onConnect() {
    }

    onDisconnect() {
    }

    onMessage() {
    }
}
