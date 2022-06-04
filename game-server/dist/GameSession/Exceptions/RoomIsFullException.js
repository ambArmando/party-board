"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomIsFullException = void 0;
const ServerException_1 = require("../../Shared/Exceptions/ServerException");
class RoomIsFullException extends ServerException_1.ServerException {
    constructor() {
        super('The room is full');
    }
}
exports.RoomIsFullException = RoomIsFullException;
