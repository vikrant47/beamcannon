import {TcpServerConfig} from "../../../config/server.config";
import net from 'net';
import {Logger} from "../../../modules/services/logging/Logger";

const uuidV4 = require('uuid').v4;

const logger = Logger.getLogger('beammeup');

/***This will open a tcp server on configured port*/
export class TcpServer {
    static _instance = new TcpServer();

    static instance(): TcpServer {
        return this._instance;
    }

    protected connections = {};
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
            });

            connection.on('data', (data) => {
                console.log("%s:%d - writing data to remote",
                    connection.remoteAddress,
                    connection.remotePort
                );
                /*const flushed = remotesocket.write(data);
                if (!flushed) {
                    console.log("  remote not flushed; pausing local");
                    connection.pause();
                }*/
            });
            connection.on('close', function (had_error) {
                console.log("%s:%d - closing remote",
                    connection.remoteAddress,
                    connection.remotePort
                );
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
}

