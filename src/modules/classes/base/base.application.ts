class BaseApplication {

    /**@return Array*/
    getEventHandlers() {
    }

    beforeRunSeeds() {
    }

    afterRunSeeds() {
    }

    beforeRunMigrations() {
    }

    afterRunMigrations() {
    }

    bootstrap() {
    }

    /**@return Number*/
    getBootstrapOrder() {
        return 1;
    }
}

export {BaseApplication};
