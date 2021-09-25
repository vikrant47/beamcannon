const middlewares = {
    auth: require('./AuthMiddleware'),
    error: require('./ErrorHandlerMiddleware')
}

module.exports = middlewares;
