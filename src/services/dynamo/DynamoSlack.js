const BadRequest = require('../../errors/bad.request');
const uuidV4 = require('uuid').v4;
const AWS = require('aws-sdk');
const {isValidModel} = require('../../models/index');
const UtilService = require('../../services/UtilService');
const QueryParser = require('../../services/dynamo/QueryParser');
AWS.config.loadFromPath('./aws-credentials.json');
const dynamoDB = new AWS.DynamoDB({
    region: 'us-east-1'
});

class DynamoSlack {
    tableName;

    constructor(tableName) {
        if (!isValidModel(tableName)) {
            throw new BadRequest(`DynamoSlack | Invalid model ${tableName}`);
        }
        this.tableName = tableName;
    }

    async create(payload) {
        if (!payload) {
            throw new BadRequest('Invalid payload in create');
        }
        const item = Object.assign({id: uuidV4()}, payload);
        let statement = `INSERT INTO "${this.tableName}" value ${QueryParser.convertToInsertValueExpression(item)}`;
        console.log(statement);
        return await dynamoDB.executeStatement({Statement: statement}).promise();
    }

    async createMultiple(payload) {
        if (!payload || !Array.isArray(payload)) {
            throw new BadRequest('Invalid payload in create');
        }
        const statements = [];
        for (const item of payload) {
            item.id = uuidV4();
            statements.push({Statement: `INSERT INTO "${this.tableName}" value ${QueryParser.convertToInsertValueExpression(item)}`})
        }
        console.log(statements);
        return await dynamoDB.batchExecuteStatement({Statements: statements}).promise();
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

    async destroyMultiple(payload) {
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
                parsedItem[key] = unescape(value);
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

module.exports = DynamoSlack;
