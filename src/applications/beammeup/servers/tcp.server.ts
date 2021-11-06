import {TcpServerConfig} from "../../../config/server.config";
import net from 'net';
import {Logger} from "../../../modules/services/logging/Logger";

import EventEmitter from 'events';

const uuidV4 = require('uuid').v4;

const logger = Logger.getLogger('beammeup');

/***This will open a tcp server on configured port*/
export class TcpServer extends EventEmitter {
    static _instance = new TcpServer();

    static instance(): TcpServer {
        return this._instance;
    }

    public connections: { string: net.Socket } = <{ string: net.Socket }>{};
    protected server: net.Server;

    protected init(): this {
        this.server = net.createServer((connection) => {
            connection['id'] = uuidV4();
            this.connections[connection['id']] = connection;
            connection.on('connect', (data) => {
                console.log(">>> connection #%d from %s:%d",
                    this.server.connections,
                    connection.remoteAddress,
                    connection.remotePort
                );
                this.emit('tcp.socket.connect', connection);
            });

            connection.on('data', (data) => {
                console.log("%s:%d - writing data to remote", connection.remoteAddress, connection.remotePort);
                this.emit('tcp.socket.data', connection, data);
                /*const flushed = remotesocket.write(data);
                if (!flushed) {
                    console.log("  remote not flushed; pausing local");
                    connection.pause();
                }*/
            });
            connection.on('close', (had_error) => {
                delete this.connections[connection['id']];
                console.log("%s:%d - closing remote",
                    connection.remoteAddress,
                    connection.remotePort
                );
                this.emit('tcp.socket.close', connection);
                // remotesocket.end();
            });
        });
        return this;
    }

    protected listen(): this {
        this.server.listen(TcpServerConfig.PORT);
        logger.debug(`Tcp server up at port ${TcpServerConfig.PORT}`);
        return this;
    }

    public start() {
        logger.debug(`Starting tcp server up at port ${TcpServerConfig.PORT}`);
        return this.init().listen();
    }

    publish(connectionId: string, message: any) {
        const connection: net.Socket = this.connections[connectionId]
        connection.write(message);
    }
}

