import middlewares from "./modules/middlewares";
import controllers from "./modules/controllers";

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

router.get('/cannon/flextables/:tableName', controllers.flexTable.getData);
router.get('/cannon/flextables/:tableName/count', controllers.flexTable.getCount);
router.post('/cannon/flextables/:tableName', controllers.flexTable.create);
router.put('/cannon/flextables/:tableName', controllers.flexTable.update);
router.put('/cannon/flextables/:tableName/updateAssignment', controllers.flexTable.updateAssignment);
router.delete('/cannon/flex/tables/:tableName', controllers.flexTable.delete);

router.get('/cannon/fstables/:tableName', controllers.flexTable.getData);
router.get('/cannon/fstables/:tableName/count', controllers.flexTable.getCount);
router.post('/cannon/fstables/:tableName', controllers.flexTable.create);
router.put('/cannon/fstables/:tableName', controllers.flexTable.update);
router.put('/cannon/fstables/:tableName/updateAssignment', controllers.flexTable.updateAssignment);
router.delete('/cannon/fstables/tables/:tableName', controllers.flexTable.delete);

router.post('/proxy/trigger/:triggerName', controllers.proxy.trigger);
export default router;
