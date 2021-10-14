class BaseApplication {
    constructor(protected alias?: string) {
    }

    getAlias(): string {
        return this.alias;
    }

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
