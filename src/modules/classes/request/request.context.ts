const {v4: uuidv4} = require('uuid');
import {AttributedObject} from "../models/attributed.object";
import {System} from "../../services/system/system.service";

class RequestContext extends AttributedObject {
    id;
    event;
    context;
    httpRequest;
    httpResponse;
    static NAMESPACE = 'request_context_namespace';

    /**@return RequestContext*/
    static getCurrentContext() {
        try {
            return System.getNamespace().get(RequestContext.NAMESPACE);
        } catch (e) {
            // console.error(e);
        }
        return null;
    }

    static create(event, context) {
        const instance = new RequestContext(event, context);
        System.getNamespace().set(RequestContext.NAMESPACE, instance);
        return instance;
    }

    constructor(event, context) {
        super();
        this.id = uuidv4();
        this.event = event;
        this.context = context;
    }

    setHttpRequest(httpRequest) {
        this.httpRequest = httpRequest;
    }

    setHttpResponse(httpResponse) {
        this.httpResponse = httpResponse;
    }

    /**@return Object*/
    getEvent() {
        return this.event;
    }

    getContext() {
        return this.context;
    }
}

export {RequestContext};
