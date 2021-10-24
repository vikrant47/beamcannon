import {Sequelize} from "sequelize";
import {FileSystem} from "../../../classes/filesystem/file.system";
import {AbstractSlack, SlackQuery} from "../base/abstract.slack";
import {DataModel} from "../../../classes/base/data.model";
import {Model} from "sequelize/types/lib/model";

const sequelize = new Sequelize('beamcanon', 'username', 'password', {
    // sqlite! now!
    dialect: 'sqlite',

    // the storage engine for sqlite
    // - default ':memory:'
    storage: `${FileSystem.getBasePath()}/database.sqlite`,
});
const models: { string: Model } = <{ string: Model }>{};

export class FsSlack extends AbstractSlack {

    registerModel(name: string, modelDefinition: any) {
        models[name] = sequelize.define(name, modelDefinition);
        return models[name];
    }

    count(query: SlackQuery): Promise<number> {
        return models[this.tableName].count(query);
    }

    findAll(query: SlackQuery): Promise<DataModel[]> {
        return models[this.tableName].findAll(query);
    }

    findById(id: string): Promise<DataModel> {
        return models[this.tableName].findById(id);
    }

    findOne(query: SlackQuery): Promise<DataModel> {
        return models[this.tableName].findOne(query);
    }

    async systemBulkCreate(items: DataModel[]): Promise<DataModel[]> {
        await models[this.tableName].bulkCreate(items.map(item => item.toArray()));
        return items;
    }

    async systemBulkUpdate(query: SlackQuery, change, items): Promise<DataModel[]> {
        await models[this.tableName].update(change, query);
        return items;
    }

    async systemCreate(item: DataModel): Promise<DataModel> {
        await models[this.tableName].create(item.toArray());
        return item;
    }

    async systemDelete(query: SlackQuery, items: DataModel[]): Promise<DataModel[]> {
        await models[this.tableName].destroy(query);
        return items;
    }

    async systemUpdate(item: DataModel): Promise<DataModel> {
        await models[this.tableName].update(item.getChanges(), {where: {id: item.getAttribute('id')}});
        return item;
    }

}
