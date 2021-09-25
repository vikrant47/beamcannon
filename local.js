const app = require('./src/server.js');
const port = process.env.PORT || 8999;

function asyncTask() {
    return new Promise((resolve) => {
        setTimeout(() => resolve('connected to database'), 1);
    })
}

// Server
(async () => {
    await asyncTask();
    app.listen(port, () => {
        console.log(`Listening on: http://localhost:${port}`);
    });
})();
