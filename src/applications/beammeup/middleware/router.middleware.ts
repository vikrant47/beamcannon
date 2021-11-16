import router from "../../../routes";

export const routeSubdomainMiddleware = (req, res, next) => {
    if (req.get('host').indexOf('server.beammeup.online') < 0 && req.get('host').indexOf('.beammeup.online') > 0) {
        const aliasIndex = req.get('host').indexOf('.beammeup.online');
        const alias = req.get('host').substring(0, aliasIndex);
        const tunnelUrl = '/tunnels/alias/' + alias + req.url;
        console.log('Forwarding request to tunnel ', tunnelUrl);
        req.url = '/tunnels/alias/' + alias + req.url;
    }
    next();
};
