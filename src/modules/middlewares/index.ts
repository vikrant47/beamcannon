const middlewares = {
    auth: require('./AuthMiddleware'),
    error: require('./ErrorHandlerMiddleware')
}

export default middlewares;
