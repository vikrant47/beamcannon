import AuthMiddleware from "./AuthMiddleware";
import ErrorHandlerMiddleware from "./ErrorHandlerMiddleware";
const middlewares = {
    auth: AuthMiddleware,
    error: ErrorHandlerMiddleware,
}

export default middlewares;
