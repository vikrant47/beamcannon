import {SystemEvent} from "../../classes/events/system.event";
import {ModelEvent} from "../../classes/events/model/model.event";
import {DataModel} from "../../classes/base/data.model";
import BadRequest from "../../classes/errors/bad.request";
import {isValidModel} from "../../classes/models";

const uuidV4 = require('uuid').v4;
const AWS = require('aws-sdk');
const UtilService = require('../../services/UtilService');
const QueryParser = require('../../services/dynamo/QueryParser');
AWS.config.loadFromPath('./aws-credentials.json');
const dynamoDB = new AWS.DynamoDB({
    region: 'us-east-1'
});

class DynamoSlack {
    static events = {
        creating: 'dynamo.slack.creating',
        updating: 'dynamo.slack.updating',
        deleting: 'dynamo.slack.deleting',
        updated: 'dynamo.slack.updated',
        created: 'dynamo.slack.created',
        deleted: 'dynamo.slack.deleted',
        validating: 'dynamo.slack.validating',
        validated: 'dynamo.slack.validated',
    };
    tableName;

    constructor(tableName) {
        if (!isValidModel(tableName)) {
            throw new BadRequest(`DynamoSlack | Invalid model ${tableName}`);
        }
        this.tableName = tableName;
    }

    async emitEvent(event, payload, bulk = false) {
        if (bulk !== true) {
            await SystemEvent.emit(event, payload);
        } else {
            const name = 'bulk' + event.substr(0, 1) + event.substr(0, event.length - 1);
            await SystemEvent.emit(new ModelEvent(name), payload)
            await Promise.all(payload.map(data => SystemEvent.emit(new ModelEvent(event), data)));
        }
    }

    async create(payload) {
        if (!payload) {
            throw new BadRequest('Invalid payload in create');
        }
        const item = new DataModel(this.tableName, Object.assign({id: uuidV4()}, payload));
        await this.emitEvent(DynamoSlack.events.validating, payload, false);
        await this.emitEvent(DynamoSlack.events.validated, payload, false);
        await this.emitEvent(DynamoSlack.events.creating, payload, false);
        let statement = `INSERT INTO "${this.tableName}" value ${QueryParser.convertToInsertValueExpression(item.toArray())}`;
        console.log(statement);
        const created = await dynamoDB.executeStatement({Statement: statement}).promise();
        await this.emitEvent(DynamoSlack.events.created, item, false);
    }

    async bulkCreate(payload) {
        if (!payload || !Array.isArray(payload)) {
            throw new BadRequest('Invalid payload in create');
        }
        const statements = [];
        const items = payload.map(item => new DataModel(this.tableName, item).newId());
        await this.emitEvent(DynamoSlack.events.validating, items, true);
        await this.emitEvent(DynamoSlack.events.validated, items, true);
        await this.emitEvent(DynamoSlack.events.creating, items, true);
        for (const item of items) {
            statements.push({Statement: `INSERT INTO "${this.tableName}" value ${QueryParser.convertToInsertValueExpression(item)}`})
        }
        console.log(statements);
        const result = await dynamoDB.batchExecuteStatement({Statements: statements}).promise();
        await this.emitEvent(DynamoSlack.events.created, items, true);
    }

    async update(query, payload, instanceId) {
        if (!payload) {
            throw new BadRequest('Invalid payload in create');
        }
        let statement = `UPDATE "${this.tableName}" ${QueryParser.convertToSetValueExpression(payload)}`;
        if (query.where) {
            const records = await this.findAll(query);
            return await Promise.all(records.map(async (record) => {
                const updateStatement = `${statement} WHERE id = '${record.id}' AND instance_id = '${instanceId}'`;
                console.log(updateStatement);
                return await dynamoDB.executeStatement({Statement: updateStatement}).promise();
            }));
        } else {
            console.log(statement);
            return await dynamoDB.executeStatement({Statement: statement}).promise();
        }


    }

    async destroy(query) {
        let statement = `DELETE
                         FROM "${this.tableName}"`;
        let whereClause = '';
        if (query.where) {
            whereClause = `WHERE ${QueryParser.parseQuery(query)}`;
            statement = `${statement} ${whereClause}`;
        }
        console.log(statement);
        return await dynamoDB.executeStatement({Statement: statement}).promise();
    }

    async bulkDestroy(payload) {
        if (!payload || !Array.isArray(payload)) {
            throw new BadRequest('Invalid payload in create');
        }
        const statements = [];
        for (const item of payload) {
            let statement = `DELETE
                             FROM "${this.tableName}"`;
            let whereClause = '';
            if (item.where) {
                whereClause = `WHERE ${QueryParser.parseQuery(item)}`;
                statement = `${statement} ${whereClause}`;
            }
            statements.push({Statement: statement})
        }
        console.log(statements);
        return await dynamoDB.batchExecuteStatement({Statements: statements}).promise();
    }

    /**@return Array*/
    async findAll(query) {
        let statement = `SELECT *
                         FROM "${this.tableName}"`;
        let whereClause = '';
        if (query.where) {
            whereClause = `WHERE ${QueryParser.parseQuery(query)}`;
            statement = `${statement} ${whereClause}`;
        }
        console.log('Query: ', statement);
        const result = await dynamoDB.executeStatement({Statement: statement}).promise();
        const parsedItems = [];
        for (const item of result.Items) {
            const parsedItem = AWS.DynamoDB.Converter.unmarshall(item)
            for (const [key, value] of Object.entries(parsedItem)) {
                parsedItem[key] = unescape(`${value}`);
            }
            parsedItems.push(parsedItem);
        }
        console.log('Result: Total ', parsedItems.length);
        return parsedItems;
    }

    /**@return Number*/
    async count(query) {
        const result = await this.findAll(query)
        return result.length;
    }

    async findOne(query) {
        const result = await this.findAll(query);
        return result && result.length > 0 ? result[0] : null;
    }


}

export default DynamoSlack;
