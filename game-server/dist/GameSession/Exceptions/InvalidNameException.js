"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidNameException = void 0;
const ServerException_1 = require("../../Shared/Exceptions/ServerException");
class InvalidNameException extends ServerException_1.ServerException {
    constructor() {
        super('Invalid name!');
    }
}
exports.InvalidNameException = InvalidNameException;
