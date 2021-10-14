class FileSystem {
    static basePath: string;

    /**@return {string} */
    static getBasePath(): string {
        return this.basePath;
    }

    static init(basePath: string) {
        this.basePath = basePath;
    }
}

export {FileSystem};
