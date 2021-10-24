export class SystemEvent {
    static listeners = {};

    /**
     * @param {ModelEvent} name
     * @param {Object} data
     */
    static async emit(name, data) {
        if (this.listeners[name]) {
            for (const callback of this.listeners[name]) {
                await callback(data);
            }
        }
    }

    /**
     * @param {string} name
     * @param {Function} callback
     */
    static on(name, callback) {
        if (!this.listeners[name]) {
            this.listeners[name] = [];
        }
        this.listeners[name].push(callback);
    }
}
