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
    subscription: 'subscription',
    connect: 'connect',
    raw: 'raw',
};
module.exports = {WebsocketResponse, WsResponseTypes};
