import {AttributedObject} from "../../models/attributed.object";

class EventMessage extends AttributedObject {

}

class BaseEvent {
    name;
    data;
    message;

    constructor(name, data, message) {
        this.name = name;
        this.data = data;
        this.message = message;
    }
}

export {BaseEvent};
