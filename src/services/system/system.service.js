class System {
    static DEFAULT_NAMESPACE = 'DEFAULT_NAMESPACE';

    static createDefaultNamespace() {
        const createNamespace = require('cls-hooked').createNamespace;
        return createNamespace(System.DEFAULT_NAMESPACE);
    }

    static getNamespace() {
        const getNamespace = require('cls-hooked').getNamespace;
        const namespace = getNamespace(System.DEFAULT_NAMESPACE);
        if (!namespace) {
            throw new Error('Namespace not initialized');
        }
        return namespace;
    }

    static isRunningInLambda() {
        return !!process.env.LAMBDA_TASK_ROOT;
    }
}

module.exports = {System};
