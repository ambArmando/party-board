import { Socket } from "socket.io"
import { Player } from "../../Entities/Player";

export interface ILobbyManager {
    join(roomName: string, playerName: string, socket: Socket): void;
    create(roomName: string, playerName: string, socket: Socket): void;
    leave(roomName: string, playerName: string, socket: Socket): void;
    message(roomName: string, message: string, socket: Socket): void;
    deleteRoom(roomName: string): void;
    getGameSessions(): void;
}