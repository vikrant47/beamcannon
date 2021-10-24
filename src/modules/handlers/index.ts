import {WebsocketHandler} from "./websocket.handler";

export const Handlers = {
    registry: [WebsocketHandler],
    async handle(event, context) {
        for (const handler of this.registry) {
            if (await handler.canHandle(event, context)) {
                await handler.handle(event, context);
            }
        }
    }
}
