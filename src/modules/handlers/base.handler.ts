abstract class BaseHandler {
    abstract canHandle(event, context): boolean;

    abstract handle(event, context);
}

export {BaseHandler};
