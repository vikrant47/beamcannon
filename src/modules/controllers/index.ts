const controllers = {
    user: require('./UserController'),
    model: require('./TableController'),
    cors: require('./CorsController'),
    lifeCycle: require('./LifecycleController'),
    proxy: require('./ProxyController')
}

export default controllers;
