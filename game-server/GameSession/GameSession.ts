import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IChallangeManager } from "../Challanges/Abstractions/IChallangeManager";
import { ChallangeManager } from "../Challanges/ChallangeManager";
import { ChallangeDto } from "../Challanges/DTO/ChallangeDto";
import { Challange, ChallangeDifficulty } from "../Entities/Challange";
import { Player } from "../Entities/Player";
import { Logger } from "../Logger/Logger";
import { IChallangeRepository } from "../Repositories/ChallangeRepository/Abstractions/IChallangeRepository";
import { ChallangeCollection, ChallangeRepository } from "../Repositories/ChallangeRepository/ChallangeRepository";
import { generateRandomHexColor } from "../Shared/Helpers";
import { IGameSession } from "./Abstractions/IGameSession";
import { GameAlreadyStartedException } from "./Exceptions/GameAlreadyStartedException";
import { InvalidNameException } from "./Exceptions/InvalidNameException";
import { RoomIsFullException } from "./Exceptions/RoomIsFullException";

enum GameStates {
    waitingForPlayersToJoin = 'waiting-players',
    waitingForDice = 'waiting-dice',
    waitingForChallangeStatus = 'waiting-challange-status',
    startingGame = 'starting-game',
    gameOver = 'game-over'
}

enum GameClientEvents {
    startGame = 'start-game',
    rollDice = 'roll-dice',
    acceptChallange = 'accept-challange',
    declineChallange = 'decline-challange',
    leaveGame = 'leave-game',
    eliminatePlayer = 'eliminate-player',
    gameOver = 'game-over',
    addChallanges = 'add-challanges'
}

enum GameServerEvents {
    playerJoined = 'state-updated',
    playerLeft = 'player-left',
    message = 'new-message',
    startGame = 'start-game',
}

enum GameServerSingleClientEvents {
    sendPlayerData = 's-player-data'
}

export class GameSession implements IGameSession {
    private io: Socket
    private players: Array<Player> = [];
    private roomName: string;
    private roomSize: number = 3;
    private messageBody: string = "";
    private id: number = 0;
    private currentPlayerIndex: number = 0;
    private diceValue: number = 0;
    private eliminatedPlayersCount: number = 0;
    private colors: Array<string> = ['fuchsia', 'purple', 'lightBlue', 'lightgreen', 'tan', 'yellow', 'teal', 'indigo'];
    private errorMessage: string = "";
    private currentChallange: Challange;
    private diceCounter: number = 1;

    // Dependencies 
    private challangeManager: IChallangeManager = new ChallangeManager();
    private challangeRepository: IChallangeRepository = new ChallangeRepository();


    private currentState: GameStates = GameStates.waitingForPlayersToJoin;

    constructor(roomName: string, io: Socket) {
        this.roomName = roomName;
        this.io = io;
    }
    
    /** */
    private getCurrentState(): any {
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
            currentChallange: this.currentChallange
        };
    }

    getID(): number {
        return this.id++;
    }

    private getNextAvailablePlayer(): void {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        let currentPlayerPoints = this.players[this.currentPlayerIndex].points;
		if (currentPlayerPoints === 0) {
			while (this.players[this.currentPlayerIndex].points === 0) {
				this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
			}
		}
    }

    private getRandomColor(): string {
        let randomNumber = Math.floor(Math.random() * this.colors.length);
        let randomColor = this.colors[randomNumber];
        this.colors.splice(randomNumber, 1)
        return randomColor;
    }

    /** Server to client */
    private informPlayers(event?: GameServerEvents) {
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

    private sendMessage(message: string, username?: string) {
        const payload = {
            message: message,
            username: username,
        }
        this.io.to(this.roomName).emit('new-message', payload);
    }

    private sendErrorMessage(socket: string, errorMessage: string) {
        this.io.to(socket).emit('error-message', errorMessage);
    }
    
    /** Client to server */
    private handleStartGame() {
        console.log("start the game");
        this.currentState = GameStates.startingGame;
        this.challangeManager.addChallanges(this.challangeRepository.getChallangeCollection(ChallangeCollection.standard));
        
        this.informPlayers(GameServerEvents.startGame);
    }

    private handleRollDice(currentPlayer: any, diceValue: number, currentPlayerIndex: number) {
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
        } else {
            console.log("in else zar: ", diceValue);
            console.log("in else diceCounter: ", this.diceCounter);
            console.log("[else]i si j pt challange dificulty: ", currentPlayer.i, currentPlayer.j);
            if (currentPlayer.i % 2 == 0 && currentPlayer.i > 0) {
                console.log("trebe hard");
                this.currentChallange = this.challangeManager.getUnusedChallange(ChallangeDifficulty.Hard);
            } else if (currentPlayer.j % 3 == 0) {
                this.currentChallange = this.challangeManager.getUnusedChallange(ChallangeDifficulty.Medium);
            } else {
                this.currentChallange = this.challangeManager.getUnusedChallange(ChallangeDifficulty.Easy);
            }
            this.diceCounter = 1;
        }

        this.diceValue = diceValue;
        this.currentState = GameStates.waitingForDice;
        this.informPlayers();
    }

    private handleAcceptChallange() {
        this.getNextAvailablePlayer();
        this.informPlayers();
    }

    private handleDeclineChallange(currentPlayer: Player) {
        for (const player of this.players) {
            if (player.name === currentPlayer.name) {
                player.points = currentPlayer.points;
            }
        }
        this.getNextAvailablePlayer();
        this.informPlayers();
    }

    private handleEliminatePlayer(eliminatedPlayer: Player) {
        for (const player of this.players) {
            if (player.name === eliminatedPlayer.name) {
                player.name = player.name + " " + "eliminated!";
                player.points = 0;
                this.eliminatedPlayersCount += 1;
            }
        }
        this.informPlayers();
    }

    private handleGameOver(winner: Player) {
        for (const player of this.players) {
            if (player.name === winner.name) {
                player.name = player.name + " " + "WON!";
            }
        }
        this.currentState = GameStates.gameOver;
        this.informPlayers();
    }

    private handleAddChallanges(challangesList: Array<ChallangeDto>) {
        // TODO: verificari
        this.challangeManager.addChallanges(challangesList);
    }

    private initSocketHandlers(socket: Socket): void {
        socket.on(GameClientEvents.startGame, () => {
            this.handleStartGame();
        });

        socket.on(GameClientEvents.rollDice, (currentPlayer: Player, diceValue: number, currentPlayerIndex: number) => {
            this.handleRollDice(currentPlayer, diceValue, currentPlayerIndex);
        });

        socket.on(GameClientEvents.acceptChallange, () => {
            this.currentState = GameStates.waitingForChallangeStatus;
            this.handleAcceptChallange();
        });

        socket.on(GameClientEvents.declineChallange, (currentPlayer) => {
            this.currentState = GameStates.waitingForChallangeStatus;
            this.handleDeclineChallange(currentPlayer);
        });

        socket.on(GameClientEvents.eliminatePlayer, (eliminatedPlayer: Player) => {
            this.handleEliminatePlayer(eliminatedPlayer);
        });

        socket.on(GameClientEvents.gameOver, (winner: Player) => {
            this.handleGameOver(winner);
        });

        socket.on(GameClientEvents.addChallanges, (challangesList: Array<ChallangeDto>) => {
            this.handleAddChallanges(challangesList);
        });
    }

    /** Public api */
    addPlayer(playerName: string, socket: Socket) {

        if (this.currentState !== GameStates.waitingForPlayersToJoin) {
            this.errorMessage = "The game has already started!";
            this.sendErrorMessage(socket.id, this.errorMessage);
            throw new GameAlreadyStartedException();
        }

        if (this.players.length + 1 > this.roomSize) {
            this.errorMessage = "The room you're trying to join is full!";
            this.sendErrorMessage(socket.id, this.errorMessage);
            throw new RoomIsFullException();
        }

        if (playerName.trim() === "") {
            this.errorMessage = "Please pick a name!";
            this.sendErrorMessage(socket.id, this.errorMessage);
            throw new InvalidNameException();
           // playerName = "Anonymous" + " " + Math.floor(Math.random() * 100);
        }

        // let playersNamesRecord: Record<string, number> = {};
        // for (const player of this.players) {
        //     console.log(playersNamesRecord[player.name] === 0);
        //     if (playersNamesRecord[player.name] === undefined) {
        //         playersNamesRecord[player.name] = 1;
        //     } else {
        //         playersNamesRecord[player.name] = playersNamesRecord[player.name] + 1;
        //     }
        // }

        // console.log('asa arata recordu in mortii matii', playersNamesRecord);

        // if (playersNamesRecord[playerName] > 1) {
        //     playerName += playersNamesRecord[playerName] + 1;
        // }
        let playersNames = [];
        for (const player of this.players) {
            playersNames.push(player.name);
        }

        if (playersNames.indexOf(playerName) > -1) {
            this.errorMessage = "Player with this name already in the session!";
            this.sendErrorMessage(socket.id, this.errorMessage);
            throw new InvalidNameException();
        }
        
        console.log("player name", playerName);
        const player = new Player({
            id: this.getID(),
            name: playerName,
            color: this.getRandomColor(),
            points: 300,
            position: {i: 9, j: 9},
            lastPosition: {lastI: null, lastJ: null},
            socket: socket
        });
        this.players.push(player);

        this.initSocketHandlers(socket);
        socket.join(this.roomName);
        this.sendMessage(`${playerName} joined the room!`);
        this.informPlayers(GameServerEvents.playerJoined);
        //socket.emit(GameServerSingleClientEvents.sendPlayerData, player.toJson);
        this.io.to(socket.id).emit(GameServerSingleClientEvents.sendPlayerData, player.toJson());
        console.log('Player joined' + playerName);
    }

    removePlayer(playerName: string, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].name === playerName) {
                this.players.splice(i, 1)
                socket.leave(this.roomName);
            }
        }
        this.sendMessage(`${playerName} left the room!`);
        this.informPlayers(GameServerEvents.playerLeft);
    }

    message(message: string, socket: Socket) {
        this.messageBody = `${socket.data.username} said: ${message}`;
        this.sendMessage(this.messageBody, socket.data.username);
    }

}