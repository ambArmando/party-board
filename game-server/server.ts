import { Socket } from "socket.io";
import { Player } from "./Entities/Player";
import { InvalidNameException } from "./GameSession/Exceptions/InvalidNameException";
import { ILobbyManager } from "./Lobby/Abstractions/ILobbyManager";
import { LobbyManager } from "./Lobby/LobbyManager";
import { Logger } from "./Logger/Logger";
import { ServerException } from "./Shared/Exceptions/ServerException";

const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080', '*'],
    }
});

const lobbyManager: ILobbyManager = new LobbyManager(io);
const logger = Logger.instance();

io.on('connection', (socket: Socket) => {
    
    logger.log(`Socket connected ${socket.id}`);
    socket.on('create-room', (roomName: string, playerName: string) => {
        try {
            if (roomName.trim() !== "") {
                socket.data.username = playerName;
                lobbyManager.create(roomName, playerName, socket);
            } else {
                console.log("invalid name");
                io.to(socket.id).emit('error-message', "Nu se poate creea o camera cu numele acesta!");
                throw new InvalidNameException();
            }
        } catch (e: any) {
            if (e instanceof ServerException) {
                console.error(e.message);
            } else {
                console.error('Error: ', e);
            }
        }
    });

    socket.on('join-room', (roomName: string, playerName: string) => {
        try {
            socket.data.username = playerName;
            lobbyManager.join(roomName, playerName, socket);
        } catch (e: any) {
            if (e instanceof ServerException) {
                console.error(e.message);
            } else {
                console.error('Error: ', e);
            }
        }
    });

    socket.on('leave-room', (roomName: string, playerName: string) => {
        try {
            lobbyManager.leave(roomName, playerName, socket);
        } catch (e: any) {
            console.error('Error: ', e);
        }
    });

    socket.on('send-message', (roomName: string, message: string, isFromBoard?: boolean) => {
        try {
            lobbyManager.message(roomName, message, socket, isFromBoard);
        } catch (e: any) {
            console.error('Error: ', e);
        }
    });

    socket.on('delete-room', (roomName: string) => {
        try {
            console.log("room in server", roomName);
            lobbyManager.deleteRoom(roomName);
        } catch (e: any) {
            console.error('Error: ', e);
        }
    });

});