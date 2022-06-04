"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameAlreadyStartedException = void 0;
const ServerException_1 = require("../../Shared/Exceptions/ServerException");
class GameAlreadyStartedException extends ServerException_1.ServerException {
    constructor() {
        super('The game already started');
    }
}
exports.GameAlreadyStartedException = GameAlreadyStartedException;
