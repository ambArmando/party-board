"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LobbyManager = void 0;
const GameSession_1 = require("../GameSession/GameSession");
const RoomDoesNotExistException_1 = require("./Exceptions/RoomDoesNotExistException");
const RoomExistsException_1 = require("./Exceptions/RoomExistsException");
const Logger_1 = require("../Logger/Logger");
class LobbyManager {
    constructor(io) {
        this._gameSessions = {};
        this.logger = Logger_1.Logger.instance();
        this.io = io;
    }
    roomExists(roomName) {
        return this._gameSessions[roomName] !== undefined;
    }
    /** Public api */
    create(roomName, playerName, socket) {
        if (!this.roomExists(roomName)) {
            this._gameSessions[roomName] = new GameSession_1.GameSession(roomName, this.io);
        }
        else {
            this.io.to(socket.id).emit('error-message', `Camera '${roomName}' există deja!`);
            throw new RoomExistsException_1.RoomExistsException(roomName);
        }
        this.logger.log(`Created room ${roomName}`);
        this.join(roomName, playerName, socket);
    }
    join(roomName, playerName, socket) {
        if (!this.roomExists(roomName)) {
            this.io.to(socket.id).emit('error-message', `Camera '${roomName}' nu există!`);
            throw new RoomDoesNotExistException_1.RoomDoesNotExistException(roomName);
        }
        else {
            this._gameSessions[roomName].addPlayer(playerName, socket);
            this.logger.log(`Joined room ${roomName} -> ${playerName}`);
        }
    }
    leave(roomName, playerName, socket) {
        this._gameSessions[roomName].removePlayer(playerName, socket);
        this.logger.log(`Left room ${roomName} -> ${playerName}`);
    }
    message(roomName, message, socket) {
        this._gameSessions[roomName].message(message, socket);
        this.logger.log(`PLayer ${socket.data.username} said -> ${message} in room ${roomName}`);
    }
    deleteRoom(roomName) {
        delete this._gameSessions[roomName];
        this.logger.log(`${roomName} was deleted!`);
    }
    getGameSessions() {
    }
}
exports.LobbyManager = LobbyManager;
