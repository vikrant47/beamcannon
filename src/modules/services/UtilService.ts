const AWS = require('aws-sdk');

export default {
    convertDynamoDBToJSON(dynamoDbObjectResult) {
        const unmarshalledItems = [];
        for (const item of dynamoDbObjectResult["Items"]) {
            unmarshalledItems.push(AWS.DynamoDB.Converter.unmarshall(item));
        }
        return unmarshalledItems;
    },
    deepClone(query) {
        return JSON.parse(JSON.stringify(query));
    },
    covertFilterObjectToWhereClause(filters) {
        if (!filters) {
            return '';
        }
        if (typeof filters === 'string') {
            filters = JSON.parse(filters);
        }
        const conditionStringArray = [];
        for (const filter of filters) {
            conditionStringArray.push(`${filter.column} ${filter.operator} '${filter.value}'`);
        }
        return conditionStringArray.join(' AND ');
    },
    safeParse(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return '';
        }
    },
    getRandomString() {
        return (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
    }
}
