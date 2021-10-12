class AttributedObject {
    attributes = {};

    setAttribute(name, value) {
        if (typeof name === 'string') {
            this.attributes[name] = value;
        } else if (name) {
            Object.assign(this.attributes, name);
        }
        return this;
    }

    getAttribute(name) {
        return this.attributes[name];
    }
}

export {AttributedObject};
