const {System} = require("./enums/system.enums");
const {RequestContext} = require("./request/request.context");

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const app = express()
const routes = require('./routes');

const {getCurrentInvoke} = require('@vendia/serverless-express');

app.use((req, res, next) => {
    const requestContext = RequestContext.getCurrentContext();
    if (!requestContext) {
        const {event, context} = getCurrentInvoke();
        return System.createDefaultNamespace().runAndReturn(() => {
            const requestContext = RequestContext.create(event, context);
            requestContext.setHttpRequest(req);
            requestContext.setHttpResponse(res);
            return next();
        });
    }
});
app.use(compression())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// NOTE: tests can't find the views directory without this
app.set('views', path.join(__dirname, 'views'))
// The serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use('/', routes)

// Export your express server so you can import it in the lambda function.
module.exports = app;
