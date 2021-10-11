class FileSystem {
    /**@return {string} */
    static getBasePath() {
        return process.env.PWD;
    }
}

module.exports = {FileSystem};
