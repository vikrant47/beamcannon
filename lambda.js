import {System} from "./src/enums/system.enums";
import {RequestContext} from "./src/request/request.context";

require('source-map-support/register')
const serverlessExpress = require('@vendia/serverless-express')
const app = require('./src/server')

let serverlessExpressInstance

function asyncTask() {
    return new Promise((resolve) => {
        setTimeout(() => resolve('connected to database'), 1);
    })
}

async function setup(event, context) {
    const asyncValue = await asyncTask()
    console.log(asyncValue)
    serverlessExpressInstance = function (event, context) {
        return System.createDefaultNamespace().runAndReturn(() => {
            RequestContext.create(event, context);
            return (serverlessExpress({app})).apply(this, arguments);
        })
    };
    return serverlessExpressInstance(event, context)
}

function lambda(event, context) {
    if (serverlessExpressInstance) return serverlessExpressInstance(event, context)

    return setup(event, context)
}

exports.handler = lambda
