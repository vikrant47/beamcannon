import {FileSystem} from "../../classes/filesystem/file.system";
import {BaseApplication} from "../../classes/base/base.application";
import {Logger} from "../logging/Logger";

const logger = Logger.getLogger('ApplicationManager');

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
    sortByOrder(): BaseApplication[] {
        return <BaseApplication[]>Object.values(this.applications).sort(
            (app1: BaseApplication, app2: BaseApplication) => app2.getBootstrapOrder() - app1.getBootstrapOrder()
        );
    }

    /**
     * Load applications by reading app files from the filesystem
     */
    loadApplications(): Promise<any> {
        logger.log('Loading applications')
        // const appFiles = [];
        const fs = require('fs');
        return new Promise((resolve, reject) => {
            fs.readdir(FileSystem.getBasePath() + '/applications', (err, files) => {
                if (err) {
                    reject(err);
                }
                files.forEach(alias => {
                    //appFiles.push();
                    const filePath = '../../../applications/' + alias + '/application';
                    logger.log(`Loading application ${alias}`);
                    const {Application} = require(filePath);
                    this.applications[alias] = new Application(alias);
                    logger.log(`Application ${alias} loaded`);
                });
                resolve(this.applications);
            });
        });
    }

    /**This will scan all app dirs and bootstrap application file**/
    async bootstrapAppApplications(routes) {
        logger.log('Bootstrapping applications')
        await this.loadApplications();
        for (const application of this.sortByOrder()) {
            logger.log(`Bootstrapping application ${application.getAlias()}`);
            await application.bootstrap();
        }
        logger.log(`Bootstrapping applications completed`);
    }

}

export {ApplicationManager};
