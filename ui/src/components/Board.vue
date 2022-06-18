<template>
<div class="board-contents">
	<div class="board-players">
		<div class="border-bottom mb-0" v-for="player in players" :key="player">
			<div class="form-group-row ml-3">
				<h4> {{player.name}} </h4>
				<div class="mr-3"> </div>
				<h4 :class="player.color" class="color"> {{player.color}} </h4> 
			</div>
			<p class="mb-2 mt-3 ml-3"> Puncte rămase: {{player.points}} </p>
		</div>
	</div>
		 <div class="board-wrapper" ref="wrapper">
			 <div class="canvas-wrapper">
				<canvas id="board" ref="canvas"> </canvas>
			 </div>
		</div>
		<div class="board-chat">
			<br>
			<p> Este rândul lui {{players[currentPlayerIndex].name}} </p>
			<button :disabled="!isMyTurn" @click="moveCurrentPlayer" class="dice" :class="{disabled: disableDice}">
				<div v-if="currentDiceValue === 1">
					<i class="fa-solid fa-dice-one fa-9x"></i>
				</div>
				<div v-else-if="currentDiceValue === 2">
					<i class="fa-solid fa-dice-two fa-9x"></i>
				</div>
				<div v-else-if="currentDiceValue === 3">
					<i class="fa-solid fa-dice-three fa-9x"></i>
				</div>
				<div v-else-if="currentDiceValue === 4">
					<i class="fa-solid fa-dice-four fa-9x"></i>
				</div>
				<div v-else-if="currentDiceValue === 5">
					<i class="fa-solid fa-dice-five fa-9x"></i>
				</div>
				<div v-else>
					<i class="fa-solid fa-dice-six fa-9x"></i>
				</div>
			</button>
			<div class="mb-4"></div>
			<!-- <p v-if="currentDiceValue > 0">  {{currentDiceValue}}</p> -->
			<Dialog v-if="togglePopup">
				<h3 class="popup-text pt-4"> {{currentChallangeText}} </h3>
				<div>
					<h4 class="ml-4 pl-2 mt-6">
						<div v-if="isMultiplayer">
							Dificultate: {{currentChallangeDificultyMultiplayer}}
						</div>
						<div v-else>
							Dificultate: {{challangeDifficulty}}
						</div>
					</h4>
					<h4 class="ml-4 pl-2 ">
						<div v-if="isMultiplayer">
							Cost provocare: {{currentChallangeCostMultiplayer}} puncte
						</div>
						<div v-else>
							Cost provocare: {{currentChallangeCost}} puncte
						</div>
					</h4>
				</div>
				<div class="popup">
					<div class="ml-4"></div>
					<button class="btn accept mt-9 mr-7" :disabled="!isMyTurn" :class="{disabled: !isMyTurn}" @click="doneChallange">
						<i class="fa-solid fa-check fa-2x"> </i>
					</button>
					<button class="btn decline ml-5 mt-9 " :disabled="!isMyTurn" :class="{disabled: !isMyTurn}" @click="onDeclineChallange"> 
						<i class="fa-solid fa-xmark fa-2x"> </i>
					</button>
					<div class="mr-4"></div>
				</div>
			</Dialog>
			<Dialog v-if="toggleWinningScreen">
				<div>
					<h2 class="mb-8 winScreen">🎉 Căștigătorul este, <span class="winner">{{winner}}</span> ! 🎉</h2>
					<button class="btn " @click="backToMainMenu"> Înapoi la ecranul principal </button>
				</div>
			</Dialog>
			<div v-if="isMultiplayer">
				<div ref="chatBoxRefBoard">
					<ul class="ul p-0">
						<li v-for="message in messages" :key="message">
							<div class="pt-2"></div>
							<p class="mt-0 mb-0">
								{{message}}
							</p> 
						</li>
					</ul>
				</div>
				<div class="form-group-row">
					<!--<div class="ml-6"></div>-->
					<input style="width: 100%;" @keyup.enter="sendMessage" type="text" v-model="message" placeholder="Scrie ceva..." maxlength="50" >
					<Button class="ml-2 pr-2 pl-2" type="btn btn-icon" @click="sendMessage"> <i class="fa-solid fa-paper-plane"></i> </Button>
				</div>
			</div>
		</div>
</div>	
</template>

<script>
import { mapGetters } from 'vuex';
import Dialog from '../widgets/dialogs/Dialog';
import Button from './buttons/Button.vue';
import {io} from 'socket.io-client';

export default {
	components: {
		Dialog, Button
	},

	data: () => ({
		board: null,
		ctx: null,
		squareSize: null,
		canvasWidth: 0,
		canvasHeight: 0,
		currentPlayerIndex: 0,
		processingPlayer: false,
		startPosition: [9, 9],
		currentDiceValue: 0,
		currentChallange: '',
		currentChallangeDificulty: '',
		togglePopup: false,
		eliminatedPlayersCount: 0,
		disableDice: false,
		toggleWinningScreen: false,
		currentChallangeCost: '',
		winner: '',
		challangeDifficulty: '',
		messages: [],
		message: '',
		grid: [[3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   [1, 0, 0, 1, 1, 1, 1, 0, 0, 0], 
			   [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			   [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
			   [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
			   [1, 0, 1, 1, 1, 1, 0, 0, 0, 0],
			   [1, 0, 1, 0, 0, 1, 0, 0, 0, 0],
			   [1, 1, 1, 0, 0, 1, 1, 1, 1, 2]],
	}),

	mounted() {

		for (let player of this.players) {
			this.$store.dispatch('setPlayerPosition', {
				player: player,
				i: this.startPosition[0],
				j: this.startPosition[1]
			})
			console.log(player);
		}

		if (this.isMultiplayer) {
			this.sockett.on("state-update", (payload) => {
				console.log("payloadu din board", payload);
				this.currentPlayerIndex = payload.state.currentPlayerIndex;
				this.currentDiceValue = payload.state.diceValue;
				this.eliminatedPlayersCount = payload.state.eliminatedPlayersCount;
				this.togglePopup = payload.state.popup;
				this.toggleWinningScreen = payload.state.toggleWinnerDialog;
				this.winner = payload.state.winner;
				let updatedPlayers = [];
				
				for (const player of payload.state.players) {
					updatedPlayers.push({
						name: player.name,
						color: player.color,
						points: player.points,
						i: player.position.i,
						j: player.position.j,
						lastI: player.lastPosition.lastI,
						lastJ: player.lastPosition.lastJ
					})
				}
				console.log("updated players:", updatedPlayers);
				this.$store.dispatch('setPlayersArray', updatedPlayers);

				if (payload.state.currentState === "game-over") {
					this.disableDice = true;
				}
				
				this.$store.dispatch('setCurrentGameState', payload.state);

			});

			this.sockett.on("new-message-board", (payload) => {
				console.log('new message payload', payload);
				this.chatBox(payload);
			});

			
		}
		this.start();
	},

	computed: {
		...mapGetters({
			players: 'getPlayers',
			thisPlayer: 'getThisPlayer',
			sockett: 'getSocket',
			isMultiplayer: 'getIsMultiplayer',
			roomName: 'getRoomName',
			currentGameState: 'getCurrentGameState'
		}),

		currentChallangeText() {
			if (this.currentGameState.currentChallange !== undefined) {
				return this.currentGameState.currentChallange.text;
			}
			return "There is a problem";
		},

		currentChallangeDificultyMultiplayer() {
			if (this.currentGameState.currentChallange !== undefined) {
				let diff = this.currentGameState.currentChallange.difficulty;
				if (diff == 0) {
					return "usor";
				} else if (diff == 1) {
					return "medie";
				} else {
					return "grea";
				} 
			}
		},

		currentChallangeCostMultiplayer() {
			if (this.currentGameState.currentChallange !== undefined) {
				let diff = this.currentGameState.currentChallange.difficulty;
				if (diff == 0) {
					return "100";
				} else if (diff == 1) {
					return "200";
				} else {
					return "300";
				} 
			}
		},

		isMyTurn() {
			console.log("CurrentState", this.currentGameState['players']);
			try {
				return this.currentGameState['players'][this.currentGameState['currentPlayerIndex']].id === this.thisPlayer.id;
			} catch (error) {
				console.trace(error);
				return false;		
			}
		}
	},

	methods: {

		update() {
			let rect = this.$refs.wrapper.getBoundingClientRect();
			this.board = this.$refs.canvas;
			this.ctx = this.board.getContext("2d");
			
			/*this.canvasWidth = rect.width;
			this.canvasHeight = rect.height;
*/		//	console.log(rect.height);
			const min = Math.floor(Math.min(rect.height, rect.width));
			this.canvasWidth = min;
			this.canvasHeight = min;//Math.min(this.canvasWidth, rect.height);

			this.board.width = this.canvasWidth;
			this.board.height = this.canvasHeight;
			this.computeSquareSize();
		},

		renderBoard() {
			for (let i = 0; i < this.grid.length; i++) {
				for (let j = 0; j < this.grid[0].length; j++) {
					let square = this.grid[i][j];
					if (square == 2 || square == 3) {
						this.ctx.fillStyle = 'purple'; //finish and start line
					} else {
						if (square === 0) {
							this.ctx.fillStyle = 'white';
						} else if (j % 2 == 0 && j != 0){
							this.ctx.fillStyle = 'red';
						} else if (i % 3 == 0 ) {
							this.ctx.fillStyle = 'orange';
						} else {
							this.ctx.fillStyle = 'green';
						}
					}
					this.ctx.fillRect(j * this.squareSize, i * this.squareSize, this.squareSize, this.squareSize);
				}
			} 
		},

		renderPlayers() {
			for (let i = 0; i < this.players.length; i++) {
				let player = this.players[i];
				this.ctx.fillStyle = player.color;
				this.ctx.fillRect(player.i * this.squareSize + i * 5, player.j * this.squareSize, this.squareSize / 4, this.squareSize / 4);
			}
		},

		computeSquareSize() {
			let size = Math.min(this.canvasWidth, this.canvasHeight);
			this.squareSize = size / (this.grid[0].length);
		},

		renderDebug() {
			this.ctx.fillStyle = 'black';
			this.ctx.fillText(`width: ${this.canvasWidth} height: ${this.canvasHeight}`, 10, 10);
		},

		render() {
			this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
			this.renderBoard();
			this.renderPlayers();
			//this.renderDebug();
		},

		moveCurrentPlayer() {
			const diceValue = this.getRandomNumber();
			this.currentDiceValue = diceValue;
			let currentPlayer = this.players[this.currentPlayerIndex];
			let lastI = currentPlayer.lastI;
			let lastJ = currentPlayer.lastJ;
			let i = currentPlayer.i;
			let j = currentPlayer.j;
			for (let k = 0; k < diceValue; k++) {
				// console.log(currentPlayer);
				// console.log('i: ' + i, 'j: ' + j);
				// console.log('lastI: ' + lastI, 'lastJ: ' + lastJ);
				let possibleMoves = this.getPossibleMoves(j, i);
				for (let move of possibleMoves) {
				   // console.log("current move being checked: " + move);
					if ((move[0] != lastJ || move[1] != lastI)) {
						//console.log("inainte",currentPlayer);
						this.$store.dispatch('setPlayerPosition', {
							player: currentPlayer,
							i: move[1],
							j: move[0]
						});
						
						if (this.isMultiplayer) {
							console.log("playerrr", currentPlayer);
							this.moveCurrentPlayerServer(currentPlayer, diceValue, this.currentPlayerIndex);
						//	this.sockett.emit("toggle-popup", );
						}
						lastI = currentPlayer.lastI;
						lastJ = currentPlayer.lastJ;
						i = move[1];
						j = move[0];
						//console.log('next: ' +  i, j);
						break;
					}
				} 

				if (currentPlayer.i === 0 && currentPlayer.j === 0) {
					console.log(currentPlayer.name + " won!!");
					this.winner = currentPlayer.name;
					this.toggleWinningScreen = true;
					if (this.isMultiplayer) {
						this.sockett.emit("game-over", currentPlayer);
						this.sockett.emit("delete-room", this.$store.getters.getRoomName);
					}
					return;
				}
			}
			//	console.log("current i: " + currentPlayer.i);
			//	console.log("current j: " + currentPlayer.j);
			
			this.computeChallange(currentPlayer.i, currentPlayer.j); 
			this.togglePopup = true;
			if (this.isMultiplayer) {
				this.sockett.emit("toggle-popup", true);
			}
		},

		getPossibleMoves(i, j) {
			let possibleMoves = [];
			// console.log(this.grid, i, j);
			// console.log(this.grid[i])
			// console.log(this.grid[i][j])
			if ( j > 0 && this.grid[i][j-1] != 0 ) {
				possibleMoves.push([i, j-1]);
			}

			if ( j < this.grid[0].length - 1 && this.grid[i][j+1] != 0 ) {
				possibleMoves.push([i, j+1]);
			}

			if ( i < this.grid.length - 1 && this.grid[i+1][j] != 0 ) {
				possibleMoves.push([i+1, j]);
			}

			if ( i > 0 && this.grid[i-1][j] != 0 ) {
				possibleMoves.push([i-1, j]);
			}

		   // console.log('possible moves: ' + possibleMoves);
			return possibleMoves;
		},

		computeChallange(i, j) {
			//TODO 3 arrays cu challangerui, Math.floor(Math.random * array.length) dupa splice cu pozitia sa eliminam challengu care a picat...
			if (i % 2 == 0 && i > 0) {
				this.currentChallange = "red challange";
				this.currentChallangeDificulty = 'red';
				this.challangeDifficulty = 'grea';
				this.currentChallangeCost = '300';
			} else if (j % 3 == 0) {
				this.currentChallange = "orange challange";
				this.currentChallangeDificulty = 'orange';
				this.challangeDifficulty = 'medie';
				this.currentChallangeCost = '200';
			} else {
				this.currentChallange = "green challange"
				this.currentChallangeDificulty = 'green';
				this.challangeDifficulty = 'ușoară';
				this.currentChallangeCost = '100';
			}
		},

		getRandomNumber() {
			const diceValue = Math.ceil(Math.random() * 6);
			console.log(diceValue);
			return diceValue;
		},

		onDeclineChallange() {
            let challangeValue;
			let currentPlayer = this.players[this.currentPlayerIndex];
			if (this.currentChallangeDificulty === 'red') {
				challangeValue = 300;
			} else if (this.currentChallangeDificulty === 'orange') {
				challangeValue = 200;
			} else {
				challangeValue = 100;
			}
			currentPlayer.points -= challangeValue;
			this.togglePopup = false;

			this.checkPlayerPoints(currentPlayer);
			this.nextAvailablePlayer(); 
			if (this.isMultiplayer) {
				console.log("game info din declineChallange", currentPlayer);
				this.sockett.emit("decline-challange", currentPlayer);
				this.sockett.emit("toggle-popup", false);
			}
        },

		doneChallange() {
			this.togglePopup = false;
			this.nextAvailablePlayer();
			if (this.isMultiplayer) {
				console.log("game info din doneChallange", this.currentPlayerIndex);
				this.sockett.emit("accept-challange");
				this.sockett.emit("toggle-popup", false);
			}
		},

		nextAvailablePlayer() {
			this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
			let currentPlayerPoints = this.players[this.currentPlayerIndex].points
			if (currentPlayerPoints === 0) {
				while (this.players[this.currentPlayerIndex].points === 0) {
					this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
				}
			}
		},

		checkPlayerPoints(currentPlayer) {
			if (currentPlayer.points <= 0) {
				if (this.isMultiplayer) {
					this.sockett.emit('eliminate-player', currentPlayer);
				}
				currentPlayer.points = 0; 
				currentPlayer.name = `${currentPlayer.name} - eliminat!`;
				this.eliminatedPlayersCount += 1;
				
				if (this.players.length - 1 === this.eliminatedPlayersCount) {
					for (let player of this.players) {
						if (player.points != 0) {
							console.log(player.name + " won!");
							this.winner = player.name;
							this.toggleWinningScreen = true;
							this.disableDice = true;

							if (this.isMultiplayer) { 
								this.sockett.emit("game-over", player);
								this.sockett.emit("delete-room", this.$store.getters.getRoomName);
							}
						}
					}
				}
			}
		},

		moveCurrentPlayerServer(currentPlayer, diceValue, currentPlayerIndex) {
			console.log("current player", currentPlayer);
			this.sockett.emit("roll-dice", currentPlayer, diceValue, currentPlayerIndex);
		},

		sendMessage() {
			console.log("salut");
			this.sockett.emit("send-message", this.roomName, this.message, true);
			this.message = '';
		},

		chatBox(payload) {
			console.log(payload);
			// if (msgBody.optionalMessage !== undefined) {
			// 	this.messages.push(msgBody.optionalMessage);
			// }
			this.messages.push(payload.message);
			this.$nextTick( () => {
				let chatBoxRefBoard = this.$refs.chatBoxRefBoard;
				if (chatBoxRefBoard !== undefined) {
					chatBoxRefBoard.scrollTop = chatBoxRefBoard.scrollHeight; 
				}
			});
		},

		backToMainMenu() {
			this.$router.push("/");
		},

		start() {
			this.update();
			this.render();
			window.requestAnimationFrame(this.start.bind(this));    
		}
	}
}
</script>

<style scoped>

	.disabled{
		pointer-events: none;
	}
	
/*
	.board-wrapper {
		display: inline-block;
		width: 75%;
		height: 100vh;
		padding: 15px;
	}

	.dice {
		display: inline-block;
		cursor: pointer;
		width: 124px;
		height: 124px;
		background: rgb(226, 226, 226);
		margin-top: 20px;
		padding: 0;
		border: 1;
	}   

	.disabled{
		pointer-events: none;
	}

	.popup {
		display: flex;
		padding: 20px;
		flex-wrap: wrap;
	}

	.popup-text {
		flex: 100%;	
	}

	.popup-btn-completed {
		flex: 50%;
	}

	.popup-btn-declined {
		flex: 50%;
	}

	.chat-box {
		background-color: antiquewhite;
		overflow-y: auto;
		width: 100%;
		height: 400px;
	}
*/

</style>