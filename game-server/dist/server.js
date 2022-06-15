"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidNameException_1 = require("./GameSession/Exceptions/InvalidNameException");
const LobbyManager_1 = require("./Lobby/LobbyManager");
const Logger_1 = require("./Logger/Logger");
const ServerException_1 = require("./Shared/Exceptions/ServerException");
const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080', '*'],
    }
});
const lobbyManager = new LobbyManager_1.LobbyManager(io);
const logger = Logger_1.Logger.instance();
io.on('connection', (socket) => {
    logger.log(`Socket connected ${socket.id}`);
    socket.on('create-room', (roomName, playerName) => {
        try {
            if (roomName.trim() !== "") {
                socket.data.username = playerName;
                lobbyManager.create(roomName, playerName, socket);
            }
            else {
                console.log("invalid name");
                io.to(socket.id).emit('error-message', "Nu se poate creea o camera cu numele acesta!");
                throw new InvalidNameException_1.InvalidNameException();
            }
        }
        catch (e) {
            if (e instanceof ServerException_1.ServerException) {
                console.error(e.message);
            }
            else {
                console.error('Error: ', e);
            }
        }
    });
    socket.on('join-room', (roomName, playerName) => {
        try {
            socket.data.username = playerName;
            lobbyManager.join(roomName, playerName, socket);
        }
        catch (e) {
            if (e instanceof ServerException_1.ServerException) {
                console.error(e.message);
            }
            else {
                console.error('Error: ', e);
            }
        }
    });
    socket.on('leave-room', (roomName, playerName) => {
        try {
            lobbyManager.leave(roomName, playerName, socket);
        }
        catch (e) {
            console.error('Error: ', e);
        }
    });
    socket.on('send-message', (roomName, message, isFromBoard) => {
        try {
            lobbyManager.message(roomName, message, socket, isFromBoard);
        }
        catch (e) {
            console.error('Error: ', e);
        }
    });
    socket.on('delete-room', (roomName) => {
        try {
            console.log("room in server", roomName);
            lobbyManager.deleteRoom(roomName);
        }
        catch (e) {
            console.error('Error: ', e);
        }
    });
});
