import {FileSystem} from "../../classes/filesystem/file.system";

class ApplicationManager {
    static _instance = new ApplicationManager();

    /**@type {{string:BaseApplication}}*/
    applications = {};

    /**@return {ApplicationManager}*/
    static instance() {
        return this._instance;
    }

    constructor() {
        if (ApplicationManager._instance) {
            throw new Error('Can not reinitialize singleton');
        }
    }

    /**@return {BaseApplication[]}*/
    sortByOrder() {
        return Object.values(this.applications).sort((app1, app2) => app2.getBootstrapOrder() - app1.getBootstrapOrder());
    }

    loadApplications() {
        // const appFiles = [];
        const fs = require('fs');
        fs.readdir(FileSystem.getBasePath() + '/applications', (err, files) => {
            files.forEach(code => {
                //appFiles.push();
                const filePath = FileSystem.getBasePath() + '/applications/' + code + '/application.js';
                import {Application} from filePath;
                this.applications[code] = new Application();
            });
        });
        return this;
    }

    /**This will scan all app dirs and bootstrap application file**/
    async bootstrapAppApplications(routes) {
        this.loadApplications();
        for (const application of this.sortByOrder()) {
            await application.bootstrap();
        }
    }

}

export {ApplicationManager};
