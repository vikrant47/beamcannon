const AWS = require('aws-sdk');
const UtilService = require('../services/UtilService');
AWS.config.loadFromPath('./aws-credentials.json');
const dynamoDB = new AWS.DynamoDB({
    region: 'us-east-1'
});

module.exports = {
    async getAllUsers(req, res, next) {
        console.log(req.query.filters, typeof req.query.filters);
        const filterQueryCondition = UtilService.covertFilterObjectToWhereClause(req.query.filters);
        try {
            console.log(filterQueryCondition);
            const statement = `SELECT * FROM test_users WHERE instance = '${req.instance}' ${filterQueryCondition ? 'AND ' + filterQueryCondition : ''}`;
            const results = await dynamoDB.executeStatement({Statement: statement}).promise();
            console.log(UtilService.convertDynamoDBToJSON(results));
            res.send(UtilService.convertDynamoDBToJSON(results));
        } catch (e) {
            res.send(e);
        }
    },

    async getUser(req, res) {
        console.log('Into Get one');
        res.json({
            id: 1,
            name: 'RJ'
        })
    }
}
