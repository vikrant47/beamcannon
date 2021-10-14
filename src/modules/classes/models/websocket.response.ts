class WebsocketResponse {
    data;
    message;
    connectionId;
    channel;
    type;
    responseCode = 200;

    constructor(settings = {}) {
        Object.assign(this, settings);
    }

    /**@return string*/
    serialize(settings) {
        return JSON.stringify(Object.assign(this, settings));
    }

}

const WsResponseTypes = {
    subscribe:'subscribe',
    unsubscribe:'unsubscribe',
    subscription: 'subscription',
    connect: 'connect',
    raw: 'raw',
};
export {WebsocketResponse, WsResponseTypes};
