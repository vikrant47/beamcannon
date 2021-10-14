import DynamoSlack from "../services/dynamo/DynamoSlack";
import {isValidModel} from "../classes/models";
import BadRequest from "../classes/errors/bad.request";

const uuidV4 = require('uuid').v4;
const AWS = require('aws-sdk');
const UtilService = require('../services/UtilService');
AWS.config.loadFromPath('./aws-credentials.json');

const TableController = {
    validateRequest(req) {
        const {tableName} = req.params;
        if (!isValidModel(tableName)) {
            throw new BadRequest(`Invalid model ${tableName}, req = ${JSON.stringify({
                query: req.query,
                body: req.body
            })}`);
        }
        /*req.instance = req.instance || req.query.instance_id;
        if (!req.instance) {
            throw new BadRequest(`Query parameter "instance_id" is not provided`);
        }*/
    },
    async getData(req, res, next) {
        try {
            const {tableName} = req.params;
            TableController.validateRequest(req);
            const query = UtilService.safeParse(req.query.query);
            const slack = new DynamoSlack(tableName);
            if (query.where) {
                query.where = {
                    '$and': [{
                        instance_id: req.instance
                    }, query.where]
                }
            }
            const result = await slack.findAll(query);
            res.send({
                data: result,
            });
        } catch (e) {
            next(e);
        }

    },
    async getCount(req, res, next) {
        try {
            const {tableName} = req.params;
            TableController.validateRequest(req);
            const query = UtilService.safeParse(req.query.query);
            const slack = new DynamoSlack(tableName);
            if (query.where) {
                query.where = {
                    '$and': [{
                        instance_id: req.instance
                    }, query.where]
                }
            }
            const result = await slack.count(query);
            res.send({
                data: result,
            });
        } catch (e) {
            next(e);
        }

    },
    async create(req, res, next) {
        try {
            const {tableName} = req.params;
            TableController.validateRequest(req);
            const slack = new DynamoSlack(tableName);
            const payload = req.body;
            payload.instance_id = req.instance;
            if (payload.ttlMs) {
                payload.ttl = new Date().getTime() + payload.ttlMs * 1;
            }
            await slack.create(payload);
            res.send({
                result: 'success',
            });
        } catch (e) {
            next(e);
        }
    },
    async update(req, res, next) {
        try {
            const {tableName} = req.params;
            TableController.validateRequest(req);
            const payload = req.body;
            let query = UtilService.safeParse(req.query.query);
            const slack = new DynamoSlack(tableName);
            if (query?.where) {
                query.where = {
                    '$and': [{
                        instance_id: req.instance
                    }, query.where]
                }
            } else {
                query = {where: {'$and': [{instance_id: req.instance}]}};
            }
            delete payload.instance_id;
            delete payload.id;
            const result = await slack.update(query, payload, req.instance);
            res.send({
                data: result,
            });
        } catch (e) {
            next(e);
        }
    },
    async delete(req, res, next) {
        try {
            const {tableName} = req.params;
            TableController.validateRequest(req);
            let query = UtilService.safeParse(req.query.query);
            const slack = new DynamoSlack(tableName);
            if (query?.where) {
                query.where = {
                    '$and': [{
                        instance_id: req.instance
                    }, query.where]
                }
            } else {
                query = {where: {'$and': [{instance_id: req.instance}]}};
            }
            const result = await slack.destroy(query);
            res.send({
                data: result,
            });
        } catch (e) {
            next(e);
        }
    },
    async updateAssignment(req, res, next) {
        try {
            const {tableName} = req.params;
            const {key} = req.query;
            const {value} = req.query;
            if (!key || !value) {
                throw new BadRequest(`Update Key or Value Not Provided`);
            }
            TableController.validateRequest(req);
            const payload = req.body;
            const {matchKey} = payload;
            const {selectedRecords} = payload;
            const slack = new DynamoSlack(tableName);
            const query = {
                where: {
                    '$and': [
                        {instance_id: req.instance}
                    ]
                }
            };
            query.where.$and[0][key] = value;

            const existingRecords = await slack.findAll(query);
            const toBeDeleted = [];
            const toBeAdded = [];
            for (const existingRecord of existingRecords) {
                let existingRecordSelected = false;
                for (const selectedRecord of selectedRecords) {
                    if (existingRecord[matchKey] === selectedRecord[matchKey]) {
                        existingRecordSelected = true;
                    }
                }
                if (!existingRecordSelected) {
                    existingRecord.where = {
                        '$and': [
                            {instance_id: req.instance},
                            {id: existingRecord.id},
                        ]
                    }
                    toBeDeleted.push(existingRecord);
                }
            }

            for (const selectedRecord of selectedRecords) {
                let selectedRecordExists = false;
                for (const existingRecord of existingRecords) {
                    if (selectedRecord[matchKey] === existingRecord[matchKey]) {
                        selectedRecordExists = true;
                    }
                }
                if (!selectedRecordExists) {
                    selectedRecord.id = uuidV4();
                    selectedRecord.instance_id = req.instance;
                    selectedRecord[key] = value;
                    toBeAdded.push(selectedRecord);
                }
            }
            if (toBeDeleted.length > 0) {
                await slack.bulkDestroy(toBeDeleted);
            }
            if (toBeAdded.length > 0) {
                await slack.bulkCreate(toBeAdded);
            }
            res.send({
                result: 'success',
            });
        } catch
            (e) {
            next(e);
        }
    }
}
export default TableController;
