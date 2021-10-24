const {app} = require('./dist/server');
const {WebsocketServer} = require("./dist/modules/websocket/websocket.server");
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
