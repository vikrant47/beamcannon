import {DataModel} from "../../../classes/base/data.model";
import {SystemEvent} from "../../../classes/events/system.event";
import {ModelEvent} from "../../../classes/events/model/model.event";
import {QueryError} from "../../../classes/errors/slack/query.error";
import BadRequest from "../../../classes/errors/request/bad.request";

const uuidV4 = require('uuid').v4;
export type SlackQuery = {
    attributes?: string[],
    where?: {};
    include?: { model: string } & SlackQuery
}

export abstract class AbstractSlack {
    static events = {
        creating: 'slack.creating',
        updating: 'slack.updating',
        deleting: 'slack.deleting',
        updated: 'slack.updated',
        created: 'slack.created',
        deleted: 'slack.deleted',
        validating: 'slack.validating',
        validated: 'slack.validated',
    };

    async emitEvent(event: string, payload: DataModel | DataModel[], bulk = false) {
        const eventName = this.getAlias() + '.' + event;
        if (bulk !== true) {
            await SystemEvent.emit(eventName, payload);
        } else {
            const name = 'bulk' + eventName.substr(0, 1) + eventName.substr(1, eventName.length - 1);
            await SystemEvent.emit(new ModelEvent(name), payload)
            await Promise.all((<DataModel[]>payload).map(data => SystemEvent.emit(new ModelEvent(event), data)));
        }
    }

    protected constructor(protected tableName: string) {
    }

    /**
     * Return alias corresponding to slack, can be used for event emission
     */
    public getAlias(): string {
        return this.constructor.name;
    }

    public abstract registerModel(name: string, modelDefinition: any);

    public abstract findById(id: string): Promise<DataModel>;

    public abstract findOne(query: SlackQuery): Promise<DataModel>;

    public abstract findAll(query: SlackQuery): Promise<DataModel[]>;

    public abstract count(query: SlackQuery): Promise<number>;

    public abstract systemCreate(item: DataModel): Promise<DataModel>;

    public abstract systemBulkUpdate(query: SlackQuery, change: any, items: DataModel[]): Promise<DataModel[]>;

    public abstract systemBulkCreate(items: DataModel[]): Promise<DataModel[]>;

    public abstract systemUpdate(item: DataModel): Promise<DataModel>;

    public abstract systemDelete(query: SlackQuery, items: DataModel[]): Promise<DataModel[]>;

    public async create(payload: any): Promise<DataModel> {
        if (!payload) {
            throw new BadRequest('Invalid payload in create');
        }
        const item = new DataModel(this.tableName, Object.assign({id: uuidV4()}, payload));
        await this.emitEvent(AbstractSlack.events.validating, item, false);
        await this.emitEvent(AbstractSlack.events.validated, item, false);
        await this.emitEvent(AbstractSlack.events.creating, item, false);
        const created = await this.systemCreate(item);
        await this.emitEvent(AbstractSlack.events.created, created, false);
        return created;
    }

    public async bulkCreate(payloads: any[]): Promise<DataModel[]> {
        if (!payloads) {
            throw new BadRequest('Invalid payload in bulk create');
        }
        const items = payloads.map(payload => new DataModel(this.tableName, Object.assign({id: uuidV4()}, payload)));
        await this.emitEvent(AbstractSlack.events.validating, items, true);
        await this.emitEvent(AbstractSlack.events.validated, items, true);
        await this.emitEvent(AbstractSlack.events.creating, items, true);
        const createdItems = await this.systemBulkCreate(items);
        await this.emitEvent(AbstractSlack.events.created, createdItems, true);
        return createdItems;
    }

    public async bulkUpdate(query: SlackQuery, change: any): Promise<DataModel[]> {
        const selectedModels = await this.findAll(query);
        if (selectedModels.length === 0) {
            throw new QueryError('No models qualifies for the given criteria ' + JSON.stringify(query));
        }
        for (const selectedModel of selectedModels) {
            selectedModel.setAttributes(change);
        }
        await this.emitEvent(AbstractSlack.events.validating, selectedModels, true);
        await this.emitEvent(AbstractSlack.events.validated, selectedModels, true);
        await this.emitEvent(AbstractSlack.events.updating, selectedModels, true);
        const createdItems = await this.systemBulkUpdate(query, change, selectedModels);
        await this.emitEvent(AbstractSlack.events.updated, createdItems, true);
        return createdItems;
    }

    public async update(id: string, payload: DataModel): Promise<DataModel> {
        const selectedModel = await this.findById(id);
        if (!selectedModel) {
            throw new QueryError('No records found with given id ' + id);
        }
        selectedModel.setAttributes(payload.getAttributes());
        await this.emitEvent(AbstractSlack.events.validating, selectedModel, false);
        await this.emitEvent(AbstractSlack.events.validated, selectedModel, false);
        await this.emitEvent(AbstractSlack.events.updating, selectedModel, false);
        const createdItem = await this.systemUpdate(selectedModel);
        await this.emitEvent(AbstractSlack.events.updated, createdItem, false);
        return createdItem;
    }

    public async delete(query: SlackQuery): Promise<DataModel[]> {
        const selectedModels = await this.findAll(query);
        if (selectedModels.length === 0) {
            throw new QueryError('No models qualifies for the given criteria ' + JSON.stringify(query));
        }
        await this.emitEvent(AbstractSlack.events.deleting, selectedModels, true);
        const deleteItems = await this.systemDelete(query, selectedModels);
        await this.emitEvent(AbstractSlack.events.deleted, deleteItems, true);
        return deleteItems;
    }

}
