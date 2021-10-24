const controllers = {
    user: require('./UserController').default,
    model: require('./TableController').default,
    cors: require('./CorsController').default,
    lifeCycle: require('./LifecycleController').default,
    proxy: require('./ProxyController').default
}

export default controllers;
