const uuidV4 = require('uuid').v4;

class DataModel {
    name;
    original = {};
    _attributes = {};
    fields = [];

    constructor(name, attributes) {
        this.name = name;
        this.attributes = attributes;
    }

    newId() {
        this.setAttribute('id', uuidV4());
        return this;
    }

    get attributes() {
        return this._attributes;
    }

    set attributes(value) {
        this.setAttribute(value);
    }

    getOriginal() {
        return this.original;
    }

    setOriginal(original) {
        this.original = original;
    }

    getAttributes() {
        return this._attributes;
    }

    setAttributes(attributes) {
        this._attributes = attributes;
    }

    getAttribute(name) {
        return this._attributes[name];
    }

    setAttribute(name, value) {
        return this._attributes[name] = value;
    }

    /**@return boolean*/
    hasEmptyAttributes(...attributes) {
        for (const name of attributes) {
            if (typeof this.getAttribute(name) !== 'undefined') {
                return false;
            }
        }
        return true;
    }

    /**@return Array*/
    getDirty() {
        return this.fields.filter(f => this._attributes[f.name] !== this.original[f.name]);
    }

    /**@return Object*/
    getChanges() {
        return this.getDirty().reduce((changed, field) => {
            changed[field.name] = this.getAttribute(field.name);
            return changed;
        }, {});
    }

    /**@return Array*/
    async toArray() {
        return this.attributes;
    }

    async serialize() {
        return JSON.stringify(this.attributes);
    }
}

export {DataModel};
