import TableController from "./TableController";
import UtilService from "../services/UtilService";
import {FsSlack} from "../services/databases/fs/fs.slack";
import {AbstractSlack} from "../services/databases/base/abstract.slack";

export const FsTableController = Object.assign({}, TableController, {
    getSlackInstance(tableName: string): AbstractSlack {
        return new FsSlack(tableName);
    },
    async getData(req, res, next) {
        try {
            const {tableName} = req.params;
            TableController.validateRequest(req);
            const query = UtilService.safeParse(req.query.query);
            const slack = this.getSlackInstance(tableName);
            const result = await slack.findAndCountAll(query);
            res.send({
                contents: result,
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
            const slack = this.getSlackInstance(tableName);
            const result = await slack.count(query);
            res.send({
                contents: result,
            });
        } catch (e) {
            next(e);
        }

    },
    async create(req, res, next) {
        try {
            const {tableName} = req.params;
            TableController.validateRequest(req);
            const slack = this.getSlackInstance(tableName);
            const payload = req.body;
            const result = await slack.create(payload);
            res.send({
                contents: result,
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
            const slack = this.getSlackInstance(tableName);
            const result = await slack.bulkUpdate(query, payload);
            res.send({
                contents: result,
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
            const slack = this.getSlackInstance(tableName);
            const result = await slack.delete(query);
            res.send({
                contents: result,
            });
        } catch (e) {
            next(e);
        }
    }
});
