const WebSocketServer = require("ws");
const {handler} = require("../../lambda");
const {WebsocketError} = require("../errors/WebsocketError");
const {v4: uuidv4} = require('uuid');

class WebsocketServer {
    wss;
    connections;
    hbInterval;
    static instance = new WebsocketServer();

    /**@return WebsocketServer*/
    static getInstance() {
        return this.instance;
    }

    constructor() {

    }

    init() {
        this.wss = new WebSocketServer({
            port: process.env.WS_PORT || 8998,
        });
        return this;
    }

    onConnection(connectId, ws, req) {
        ws.isAlive = true;
        ws.on('pong', function () {
            this.isAlive = true;
        });
    }

    onMessage(connectId, ws, message) {
        console.log('received: %s', message);
        handler().then(() => {
            console.log('Handler invoked for websocket');
        });
    }

    onClose(connectId, ws) {

    }

    listen() {
        this.wss.on('connection', (ws, req) => {
            const connectId = uuidv4();
            this.connections[connectId] = {ws, req};
            ws.connectId = connectId;
            this.onConnection(connectId, ws, req);
            ws.on('message', (message) => {
                this.onMessage(connectId, ws, message);
            });
            ws.on('close', () => {
                this.onClose(connectId, ws);
                delete this.connections[connectId];
            })
            // ws.send('something');
        });
        this.wss.on('close', () => {
            clearInterval(this.hbInterval);
        });
        this.heartbeat();
        return this;
    }

    heartbeat() {
        this.hbInterval = setInterval(() => {
            this.wss.clients.forEach((ws) => {
                if (ws.isAlive === false) return ws.terminate();
                ws.isAlive = false;
                ws.ping(() => {
                });
            });
        }, process.env.WS_HEARTBEAT_INTERVAL);
        return this;
    }

    sendMessage(connectionId, message, options = null) {
        const connection = this.connections[connectionId];
        if (!connection) {
            throw new WebsocketError('No active connection found with connection id ' + connectionId);
        }
        connection.ws.send(message, options);
    }


}

module.exports = {WebsocketServer};
