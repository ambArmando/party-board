import { Socket } from "socket.io";
import { Player } from "../../Entities/Player";

export interface IGameSession {
    addPlayer(playerName: string, socket: Socket): void;
    removePlayer(playerName: string, socket: Socket): void;
    message(message: string, socket: Socket, isFromBoard: boolean): void;
   // start(): void
}