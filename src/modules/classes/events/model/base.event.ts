import {AttributedObject} from "../../models/attributed.object";

class EventMessage extends AttributedObject {

}

class BaseEvent {
    constructor(protected name: string, protected data?: any, protected message?: any) {
        this.name = name;
        this.data = data;
    }
}

export {BaseEvent};
