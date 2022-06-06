<template>
<div class="board-contents">
	<div class="board-players">
		<table>
        <tr v-for="player in players" :key="player">
          <td>
            <span>{{ player.name }} <span :class="player.color"><p>{{ player.color }}</p></span> <br /></span> 
            Points: {{ player.points }}
          </td>
        </tr>
      </table>
	</div>
		 <div class="board-wrapper" ref="wrapper">
			 <div class="canvas-wrapper">
				<canvas id="board" ref="canvas"> </canvas>
			 </div>
		</div>
		<div class="board-chat">
			<br>
			
			<p> {{players[currentPlayerIndex].name}}'s turn </p>
			<button :disabled="!isMyTurn" @click="moveCurrentPlayer" class="dice" :class="{disabled: disableDice}">dice</button>
			<p v-if="currentDiceValue > 0">Rolled {{currentDiceValue}}</p>
			<Dialog v-if="togglePopup">
				<div class="popup">
					<p class="popup-text"> {{currentChallangeText}} </p>
					<Button @click="doneChallange" color="primary" size="medium" class="popup-btn-completed"> Challange Completed </Button>
					<Button @click="onDeclineChallange" color="red" size="medium" class="popup-btn-declined"> Decline Challange </Button>
				</div>
			</Dialog>
			<div class="chat-box" ref="chatBoxRef">
				{{ canvasWidth }}
				{{ canvasHeight }}
				<ul>
					<li v-for="message in messages" :key="message">
						{{message}}
					</li>
				</ul>
				<div v-if="isMultiplayer">
					<input type="text" v-model="message" placeholder="Type something...">
					<button class="btn" @click="sendMessage"> send message</button>
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

			this.sockett.on("new-message", (message) => {
				console.log('new message payload', message);
				this.chatBox(message);
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
*/			console.log(rect.height);
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
			this.renderDebug();
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
					if (this.isMultiplayer) {
						this.sockett.emit("delete-room", this.$store.getters.getRoomName);
					}
					return;
				}
			}
			//	console.log("current i: " + currentPlayer.i);
			//	console.log("current j: " + currentPlayer.j);
			
			this.computeChallange(currentPlayer.i, currentPlayer.j); 
			this.togglePopup = true;
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
			} else if (j % 3 == 0) {
				this.currentChallange = "orange challange";
				this.currentChallangeDificulty = 'orange';
			} else {
				this.currentChallange = "green challange"
				this.currentChallangeDificulty = 'green';
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
				challangeValue = 200;
			} else if (this.currentChallangeDificulty === 'orange') {
				challangeValue = 150;
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
			}
        },

		doneChallange() {
			this.togglePopup = false;
			this.nextAvailablePlayer();
			if (this.isMultiplayer) {
				console.log("game info din doneChallange", this.currentPlayerIndex);
				this.sockett.emit("accept-challange");
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
				currentPlayer.name = `${currentPlayer.name} eliminated :(`;
				this.eliminatedPlayersCount += 1;
				
				if (this.players.length - 1 === this.eliminatedPlayersCount) {
					for (let player of this.players) {
						if (player.points != 0) {
							console.log(player.name + " won!");
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
			this.sockett.emit("send-message", this.roomName, this.message);
			this.message = '';
		},

		chatBox(msgBody) {
			console.log(msgBody);
			// if (msgBody.optionalMessage !== undefined) {
			// 	this.messages.push(msgBody.optionalMessage);
			// }
			this.messages.push(msgBody);
			this.$nextTick( () => {
				let chatBoxRef = this.$refs.chatBoxRef;
				if (chatBoxRef !== null) {
					chatBoxRef.scrollTop = chatBoxRef.scrollHeight; 
				}
			});
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