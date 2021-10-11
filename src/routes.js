const controllers = require('./controllers');
const middlewares = require('./middlewares');
const express = require('express'),
    router = express.Router();
const cors = require('cors')

// a middleware function with no mount path. This code is executed for every request to the router
// router.use(middlewares.error.errorHandler);
router.use(cors({
    exposedHeaders: ['*'],
}));
router.use(middlewares.auth.authenticate);
router.use(middlewares.auth.instanceMiddleware);
router.options('/*', controllers.cors.allow);
router.post('/installed', controllers.lifeCycle.installed);
router.post('/uninstalled', controllers.lifeCycle.uninstalled);
router.get('/users', controllers.user.getAllUsers);
router.get('/users/:accountId', controllers.user.getUser);
router.get('/tables/:tableName', controllers.model.getData);
router.get('/tables/:tableName/count', controllers.model.getCount);
router.post('/tables/:tableName', controllers.model.create);
router.put('/tables/:tableName', controllers.model.update);
router.put('/tables/:tableName/updateAssignment', controllers.model.updateAssignment);
router.delete('/tables/:tableName', controllers.model.delete);
router.post('/proxy/trigger/:triggerName', controllers.proxy.trigger);
module.exports = router;
