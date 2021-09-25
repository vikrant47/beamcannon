const atob = require('atob');

module.exports = {
    async authenticate(req, res, next) {
        console.log('Into Auth Middleware');
        next();
    },

    async instanceMiddleware(req, res, next) {
        if (req.headers['instance']) {
            const url = new URL(atob(req.headers['instance']));
            req.instance = url.host.split('.')[0];
        } else {
            req.instance = req.query.instance_id;
        }
        next();
    }
}
