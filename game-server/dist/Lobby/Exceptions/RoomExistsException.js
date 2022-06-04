"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomExistsException = void 0;
const ServerException_1 = require("../../Shared/Exceptions/ServerException");
class RoomExistsException extends ServerException_1.ServerException {
    constructor(roomName) {
        super(`The room '${roomName}' already exists`);
        this.roomName = roomName;
    }
}
exports.RoomExistsException = RoomExistsException;
