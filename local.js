const app = require('./src/server.js');
const {WebsocketServer} = require("./src/modules/websocket/websocket.server");
const port = process.env.PORT || 8999;

function asyncTask() {
    return new Promise((resolve) => {
        setTimeout(() => {
            WebsocketServer.getInstance().init().listen();
            resolve('Started websocket server');
        }, 1);
    })
}

// Server
(async () => {
    await asyncTask();
    app.listen(port, () => {
        console.log(`Listening on: http://localhost:${port}`);
    });
})();
