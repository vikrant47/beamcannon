const Sequelize = require('sequelize');

class System {
    static DEFAULT_NAMESPACE = 'DEFAULT_NAMESPACE';

    static initSequelize(namespace) {
        Sequelize.cls = namespace;
    }

    static createDefaultNamespace() {
        const createNamespace = require('cls-hooked').createNamespace;
        const namespace = createNamespace(System.DEFAULT_NAMESPACE);
        this.initSequelize(namespace);
        return namespace;
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

export {System};
