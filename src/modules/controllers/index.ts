const controllers = {
    user: require('./UserController').default,
    flexTable: require('./TableController').default,
    fsTable: require('./FsTableController').FsTableController,
    cors: require('./CorsController').default,
    lifeCycle: require('./LifecycleController').default,
    proxy: require('./ProxyController').default
}

export default controllers;
