import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IGameSession } from "../GameSession/Abstractions/IGameSession";
import { GameSession } from "../GameSession/GameSession";
import { ILobbyManager } from "./Abstractions/ILobbyManager";
import { RoomDoesNotExistException } from "./Exceptions/RoomDoesNotExistException";
import { RoomExistsException } from "./Exceptions/RoomExistsException";
import { RoomIsFullException } from "../GameSession/Exceptions/RoomIsFullException";
import { Logger } from "../Logger/Logger";
import { Player } from "../Entities/Player";

export class LobbyManager implements ILobbyManager {
    private io: Socket;
    private _gameSessions: Record<string, IGameSession> = {};
    private logger = Logger.instance();

    constructor (io: Socket) {
        this.io = io;
    }

    private roomExists(roomName: string) : boolean {
        return this._gameSessions[roomName] !== undefined;
    }

    /** Public api */
    create(roomName: string, playerName: string, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        if (!this.roomExists(roomName)) {
            this._gameSessions[roomName] = new GameSession(roomName, this.io);
        } else {
            this.io.to(socket.id).emit('error-message', `Camera '${roomName}' există deja!`);
            throw new RoomExistsException(roomName);
        }
        
        this.logger.log(`Created room ${roomName}`);
        this.join(roomName, playerName, socket);
    }

    join(roomName: string, playerName: string, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        if (!this.roomExists(roomName)) {
            this.io.to(socket.id).emit('error-message', `Camera '${roomName}' nu există!`);
            throw new RoomDoesNotExistException(roomName);
        } else {
            this._gameSessions[roomName].addPlayer(playerName, socket);
            this.logger.log(`Joined room ${roomName} -> ${playerName}`);
        }
    }

    leave(roomName: string, playerName: string, socket: Socket): void {
        this._gameSessions[roomName].removePlayer(playerName, socket);
        this.logger.log(`Left room ${roomName} -> ${playerName}`);
    }

    message(roomName: string, message: string, socket: Socket) {
        this._gameSessions[roomName].message(message, socket);
        this.logger.log(`PLayer ${socket.data.username} said -> ${message} in room ${roomName}`);
    }

    deleteRoom(roomName: string): void {
        delete this._gameSessions[roomName];
        this.logger.log(`${roomName} was deleted!`);
    }

    getGameSessions(): void {
        
    }

}