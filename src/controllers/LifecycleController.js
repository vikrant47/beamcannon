const LifecycleController = {
    async installed(req, res, next) {
        res.send({
            result: 'success',
        });
    },
    async uninstalled(req, res, next) {
        res.send({
            result: 'success',
        });
    }
}
module.exports = LifecycleController;
