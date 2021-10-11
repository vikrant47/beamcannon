const UtilService = require('../UtilService');

module.exports = {
    operatorMapping: {
        '$eq': (field, value) => {
            return `${field} = ${typeof value === 'string' ? "'" + value + "'" : value}`;
        },
        '$ne': (field, value) => {
            return `${field} != ${typeof value === 'string' ? "'" + value + "'" : value}`;
        },
        '$gt': (field, value) => {
            return `${field} > ${value}`;
        },
        '$lt': (field, value) => {
            return `${field} < ${value}`;
        },
        '$gte': (field, value) => {
            return `${field} >= ${value}`;
        },
        '$lte': (field, value) => {
            return `${field} <= ${value}`;
        },
        '$between': (field, value) => {
            return `${field} between ${value[0]} AND ${value[1]}`;
        },
        '$ilike': (field, value) => {
            return `${field} ilike '${value}'`;
        },
        '$in': (field, values) => {
            return `${field} in (${values.map(value => typeof value === 'string' ? "'" + value + "'" : value)})`;
        },
        '$notIn': (field, values) => {
            return `${field} not in (${values.map(value => typeof value === 'string' ? "'" + value + "'" : value)})`;
        },
    },
    parseOuter(query, parsed = '') {

    },
    parseQuery(query, outer = true, parsed = '') {
        query = UtilService.deepClone(query);
        if (query.where) {
            if (outer && !query.where['$and'] && !query.where['$or']) {
                query.where['$and'] = query.where;
            }
            const where = query.where;
            for (let conditionKey in where) {
                if (where.hasOwnProperty(conditionKey)) {
                    let condition = where[conditionKey];
                    if (conditionKey === '$and' || conditionKey === '$or') {
                        parsed = `${parsed} AND ( ${condition.map(c => this.parseQuery({where: c}, false)).join(conditionKey === '$and' ? ' AND ' : ' OR ')} )`;
                    } else {
                        if (!condition['$op']) {
                            condition = {'$op': '$eq', field: conditionKey, value: condition.value || condition}
                        } else {
                            condition = {
                                '$op': condition['$op'],
                                field: conditionKey,
                                value: condition.value || condition
                            }
                        }
                        parsed = `${parsed} AND ${this.operatorMapping[condition.$op](condition.field, condition.value)}`;
                    }
                }
            }
        }
        if (parsed.startsWith(' AND')) {
            parsed = parsed.substring(4);
        }
        return parsed;
    },
    convertToSetValueExpression(payload) {
        let exp = '';
        for (const key in payload) {
            if (payload.hasOwnProperty(key)) {
                const value = payload[key];
                exp = `${exp} SET "${key}"=${typeof value === 'string' ? "'" + escape(value) + "'" : value}`;
            }
        }
        return exp;
    },
    convertToInsertValueExpression(payload) {
        const items = [];
        for (const [key, value] of Object.entries(payload)) {
            items.push("'" + key + "':" + (typeof value === 'string' ? "'" + escape(value) + "'" : value));
        }
        return '{' + items.join(",") + '}';
    }
}
