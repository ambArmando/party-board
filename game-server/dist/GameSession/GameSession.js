"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSession = void 0;
const ChallangeManager_1 = require("../Challanges/ChallangeManager");
const Challange_1 = require("../Entities/Challange");
const Player_1 = require("../Entities/Player");
const ChallangeRepository_1 = require("../Repositories/ChallangeRepository/ChallangeRepository");
const GameAlreadyStartedException_1 = require("./Exceptions/GameAlreadyStartedException");
const InvalidNameException_1 = require("./Exceptions/InvalidNameException");
const RoomIsFullException_1 = require("./Exceptions/RoomIsFullException");
var GameStates;
(function (GameStates) {
    GameStates["waitingForPlayersToJoin"] = "waiting-players";
    GameStates["waitingForDice"] = "waiting-dice";
    GameStates["waitingForChallangeStatus"] = "waiting-challange-status";
    GameStates["startingGame"] = "starting-game";
    GameStates["gameOver"] = "game-over";
})(GameStates || (GameStates = {}));
var GameClientEvents;
(function (GameClientEvents) {
    GameClientEvents["startGame"] = "start-game";
    GameClientEvents["rollDice"] = "roll-dice";
    GameClientEvents["acceptChallange"] = "accept-challange";
    GameClientEvents["declineChallange"] = "decline-challange";
    GameClientEvents["leaveGame"] = "leave-game";
    GameClientEvents["eliminatePlayer"] = "eliminate-player";
    GameClientEvents["gameOver"] = "game-over";
    GameClientEvents["addChallanges"] = "add-challanges";
    GameClientEvents["togglePopup"] = "toggle-popup";
})(GameClientEvents || (GameClientEvents = {}));
var GameServerEvents;
(function (GameServerEvents) {
    GameServerEvents["playerJoined"] = "state-updated";
    GameServerEvents["playerLeft"] = "player-left";
    GameServerEvents["message"] = "new-message";
    GameServerEvents["startGame"] = "start-game";
})(GameServerEvents || (GameServerEvents = {}));
var GameServerSingleClientEvents;
(function (GameServerSingleClientEvents) {
    GameServerSingleClientEvents["sendPlayerData"] = "s-player-data";
})(GameServerSingleClientEvents || (GameServerSingleClientEvents = {}));
class GameSession {
    constructor(roomName, io) {
        this.players = [];
        this.roomSize = 8;
        this.messageBody = "";
        this.id = 0;
        this.currentPlayerIndex = 0;
        this.diceValue = 0;
        this.eliminatedPlayersCount = 0;
        this.colors = ['fuchsia', 'lightBlue', 'lightGreen', 'tan', 'yellow', 'teal', 'indigo', 'blue'];
        this.errorMessage = "";
        this.diceCounter = 1;
        this.togglePopup = false;
        this.toggleWinnerDialog = false;
        this.winner = "";
        // Compositions 
        this.challangeManager = new ChallangeManager_1.ChallangeManager();
        this.challangeRepository = new ChallangeRepository_1.ChallangeRepository();
        this.currentState = GameStates.waitingForPlayersToJoin;
        this.roomName = roomName;
        this.io = io;
    }
    /** */
    getCurrentState() {
        const players = [];
        for (const player of this.players) {
            players.push(player.toJson());
        }
        return {
            players: players,
            currentState: this.currentState,
            currentPlayerIndex: this.currentPlayerIndex,
            diceValue: this.diceValue,
            eliminatedPlayersCount: this.eliminatedPlayersCount,
            currentChallange: this.currentChallange,
            popup: this.togglePopup,
            toggleWinnerDialog: this.toggleWinnerDialog,
            winner: this.winner,
        };
    }
    getID() {
        return this.id++;
    }
    getNextAvailablePlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        let currentPlayerPoints = this.players[this.currentPlayerIndex].points;
        if (currentPlayerPoints === 0) {
            while (this.players[this.currentPlayerIndex].points === 0) {
                this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
            }
        }
    }
    getRandomColor() {
        let randomNumber = Math.floor(Math.random() * this.colors.length);
        let randomColor = this.colors[randomNumber];
        this.colors.splice(randomNumber, 1);
        return randomColor;
    }
    /** Server to client */
    informPlayers(event) {
        this.io.to(this.roomName).emit('state-update', {
            state: this.getCurrentState(),
            event: event
        });
    }
    // private sendMessage(optionalMsg?: string) {
    //     var body = {}
    //     if (optionalMsg !== undefined) {
    //         body = {
    //             message: optionalMsg
    //         }            
    //     } else {
    //         body = {
    //             message: this.messageBody,
    //         }
    //     }
    //     this.io.to(this.roomName).emit('new-message', body);
    // }
    sendMessage(message, username, isFromBoard) {
        const payload = {
            message: message,
            username: username,
        };
        console.log(isFromBoard);
        if (isFromBoard) {
            this.io.to(this.roomName).emit('new-message-board', payload);
        }
        else {
            this.io.to(this.roomName).emit('new-message', payload);
        }
    }
    sendErrorMessage(socket, errorMessage) {
        this.io.to(socket).emit('error-message', errorMessage);
    }
    /** Client to server */
    handleStartGame() {
        console.log("start the game");
        this.currentState = GameStates.startingGame;
        this.challangeManager.addChallanges(this.challangeRepository.getChallangeCollection(ChallangeRepository_1.ChallangeCollection.standard));
        this.informPlayers(GameServerEvents.startGame);
    }
    handleRollDice(currentPlayer, diceValue) {
        // console.log("info player turn:" + currentPlayer.toString() + " " + currentPlayerIndex + " dice: " + diceValue);
        //console.log(currentPlayer);
        for (let player of this.players) {
            // console.log("inainte de if", player);
            if (currentPlayer.name === player.name) {
                console.log("gasisit");
                player.position.i = currentPlayer.i;
                player.position.j = currentPlayer.j;
                player.lastPosition.lastI = currentPlayer.lastI;
                player.lastPosition.lastJ = currentPlayer.lastJ;
            }
        }
        console.log("i si j pt challange dificulty: ", currentPlayer.i, currentPlayer.j);
        console.log(" zar: ", diceValue);
        console.log("diceCounter: ", this.diceCounter);
        if (this.diceCounter != diceValue) {
            this.diceCounter++;
        }
        else {
            console.log("in else zar: ", diceValue);
            console.log("in else diceCounter: ", this.diceCounter);
            console.log("[else]i si j pt challange dificulty: ", currentPlayer.i, currentPlayer.j);
            if (currentPlayer.i % 2 == 0 && currentPlayer.i > 0) {
                console.log("trebe hard");
                this.currentChallange = this.challangeManager.getUnusedChallange(Challange_1.ChallangeDifficulty.Hard);
            }
            else if (currentPlayer.j % 3 == 0) {
                console.log("trebe medm");
                this.currentChallange = this.challangeManager.getUnusedChallange(Challange_1.ChallangeDifficulty.Medium);
            }
            else {
                console.log("trebe ez");
                this.currentChallange = this.challangeManager.getUnusedChallange(Challange_1.ChallangeDifficulty.Easy);
            }
            this.diceCounter = 1;
        }
        this.diceValue = diceValue;
        this.currentState = GameStates.waitingForDice;
        this.informPlayers();
    }
    handleAcceptChallange() {
        this.togglePopup = false;
        this.getNextAvailablePlayer();
        this.informPlayers();
    }
    handleDeclineChallange(currentPlayer) {
        for (const player of this.players) {
            if (player.name === currentPlayer.name) {
                player.points = currentPlayer.points;
            }
        }
        this.togglePopup = false;
        this.getNextAvailablePlayer();
        this.informPlayers();
    }
    handleEliminatePlayer(eliminatedPlayer) {
        for (const player of this.players) {
            if (player.name === eliminatedPlayer.name) {
                player.name = player.name + " - " + "eliminat!";
                player.points = 0;
                this.eliminatedPlayersCount += 1;
            }
        }
        this.informPlayers();
    }
    handleGameOver(winner) {
        for (const player of this.players) {
            if (player.name === winner.name) {
                this.winner = player.name;
                // player.name = player.name + " " + "WON!";
            }
        }
        this.toggleWinnerDialog = true;
        this.currentState = GameStates.gameOver;
        this.informPlayers();
    }
    handleTogglePopup(value) {
        this.togglePopup = value;
        this.informPlayers();
    }
    handleAddChallanges(challangesList, playerName) {
        // TODO: verificari
        this.challangeManager.addChallanges(challangesList);
        this.sendMessage(`${playerName} a adăugat un set de provocări!`);
    }
    initSocketHandlers(socket) {
        socket.on(GameClientEvents.startGame, () => {
            this.handleStartGame();
        });
        socket.on(GameClientEvents.rollDice, (currentPlayer, diceValue) => {
            this.handleRollDice(currentPlayer, diceValue);
        });
        socket.on(GameClientEvents.acceptChallange, () => {
            this.currentState = GameStates.waitingForChallangeStatus;
            this.handleAcceptChallange();
        });
        socket.on(GameClientEvents.declineChallange, (currentPlayer) => {
            this.currentState = GameStates.waitingForChallangeStatus;
            this.handleDeclineChallange(currentPlayer);
        });
        socket.on(GameClientEvents.eliminatePlayer, (eliminatedPlayer) => {
            this.handleEliminatePlayer(eliminatedPlayer);
        });
        socket.on(GameClientEvents.gameOver, (winner) => {
            this.handleGameOver(winner);
        });
        socket.on(GameClientEvents.addChallanges, (challangesList, playerName) => {
            console.log("challange array de la player: ", challangesList, playerName);
            this.handleAddChallanges(challangesList, playerName);
        });
        socket.on(GameClientEvents.togglePopup, (value) => {
            console.log("value din server", value);
            this.handleTogglePopup(value);
        });
    }
    /** Public api */
    addPlayer(playerName, socket) {
        if (this.currentState !== GameStates.waitingForPlayersToJoin) {
            this.errorMessage = "Jocul este în desfășurare în această cameră!";
            this.sendErrorMessage(socket.id, this.errorMessage);
            throw new GameAlreadyStartedException_1.GameAlreadyStartedException();
        }
        if (this.players.length + 1 > this.roomSize) {
            this.errorMessage = "Camera in care vrei să intri este plină!";
            this.sendErrorMessage(socket.id, this.errorMessage);
            throw new RoomIsFullException_1.RoomIsFullException();
        }
        if (playerName.trim() === "") {
            this.errorMessage = "Alege un nume!";
            this.sendErrorMessage(socket.id, this.errorMessage);
            throw new InvalidNameException_1.InvalidNameException();
        }
        let playersNames = [];
        for (const player of this.players) {
            playersNames.push(player.name);
        }
        if (playersNames.indexOf(playerName) > -1) {
            this.errorMessage = "Există un jucator conectat cu acest nume!";
            this.sendErrorMessage(socket.id, this.errorMessage);
            throw new InvalidNameException_1.InvalidNameException();
        }
        const player = new Player_1.Player({
            id: this.getID(),
            name: playerName,
            color: this.getRandomColor(),
            points: 1000,
            position: { i: 9, j: 9 },
            lastPosition: { lastI: null, lastJ: null },
            socket: socket
        });
        this.players.push(player);
        this.initSocketHandlers(socket);
        socket.join(this.roomName);
        this.sendMessage(`${playerName} a intrat in camera!`);
        this.informPlayers(GameServerEvents.playerJoined);
        this.io.to(socket.id).emit(GameServerSingleClientEvents.sendPlayerData, player.toJson());
        console.log('Player joined' + playerName);
    }
    removePlayer(playerName, socket) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].name === playerName) {
                this.players.splice(i, 1);
                socket.leave(this.roomName);
            }
        }
        this.sendMessage(`${playerName} a parasit camera!`);
        this.informPlayers(GameServerEvents.playerLeft);
    }
    message(message, socket, isFromBoard) {
        this.messageBody = `${socket.data.username}: ${message}`;
        this.sendMessage(this.messageBody, socket.data.username, isFromBoard);
    }
}
exports.GameSession = GameSession;
