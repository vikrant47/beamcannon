import _ from 'lodash';

export abstract class BaseChannel<T> {
    protected subscriptions: T[] = [];

    protected constructor(protected path: string) {
    }

    subscribe(subscriber: T) {
        if (typeof subscriber !== 'string') {
            subscriber['subscription_id'] = _.uniqueId('subs_');
        }
        this.subscriptions.push(subscriber);
    }

    unsubscribe(subscriber: T) {
        let identifier = subscriber;
        if (typeof identifier !== 'string') {
            identifier = identifier['subscription_id'];
        }
        const index = this.subscriptions.findIndex(s => s === identifier);
        this.subscriptions.splice(index, 1);
    }

    getSubscriptions(): T[] {
        return this.subscriptions;
    }

    abstract publish(payload: any);


}
