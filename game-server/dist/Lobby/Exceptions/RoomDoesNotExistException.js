"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomDoesNotExistException = void 0;
const ServerException_1 = require("../../Shared/Exceptions/ServerException");
class RoomDoesNotExistException extends ServerException_1.ServerException {
    constructor(roomName) {
        super(`The room '${roomName}' does not exist`);
        this.roomName = roomName;
    }
}
exports.RoomDoesNotExistException = RoomDoesNotExistException;
