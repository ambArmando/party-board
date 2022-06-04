"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerException = void 0;
class ServerException extends Error {
    constructor(message) {
        super(message);
    }
}
exports.ServerException = ServerException;
