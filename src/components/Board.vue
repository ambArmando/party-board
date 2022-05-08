<template>
		 <div class="board-wrapper" ref="wrapper">
			<canvas id="board" ref="canvas"> </canvas>
		</div>
		<div>
			<br>
			<p> {{players[currentPlayerIndex].name}}'s turn </p>
			<button @click="moveCurrentPlayer" class="dice" :class="{disabled: disableDice}">dice</button>
			<p v-if="currentDiceValue > 0">Rolled {{currentDiceValue}}</p>
			<Dialog v-if="togglePopup">
				<div class="popup">
					<p class="popup-text"> {{currentChallange}} </p>
					<Button @click="doneChallange" color="primary" size="medium" class="popup-btn-completed"> Challange Completed </Button>
					<Button @click="onDeclineChallange" color="red" size="medium" class="popup-btn-declined"> Decline Challange </Button>
				</div>
			</Dialog>
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
		// socket: io('http://localhost:3000'),
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

		this.sockett.on("update-current-player", (currentPlayer, diceValue, currentPlayerIndex) => {
			console.log("current player venit de la server catre room", currentPlayer);
			this.$store.dispatch('setPlayerPosition', {
				player: currentPlayer,
				i: currentPlayer.i,
				j: currentPlayer.j
			});
			this.currentDiceValue = diceValue;
			this.currentPlayerIndex = currentPlayerIndex;
		});

		this.start();
	},

	computed: {
		...mapGetters({
			players: 'getPlayers',
			sockett: 'getSocket'
		}) 
	},

	methods: {

		update() {
			let rect = this.$refs.wrapper.getBoundingClientRect();
			this.board = this.$refs.canvas;
			this.ctx = this.board.getContext("2d");
			this.canvasWidth = rect.width;
			this.canvasHeight = rect.height;
			this.board.width = this.canvasWidth;
			this.board.height = this.canvasHeight - 10;
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
			this.squareSize = size / (this.grid[0].length + 2);
		},

		renderDebug() {
			this.ctx.fillStyle = 'black';
			this.ctx.fillText(`width: ${this.canvasWidth} height: ${this.canvasHeight}`, 10, 10);
		},

		render() {
			this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
			this.renderBoard();
			this.renderPlayers();
			// this.socket.emit();
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
						console.log("inainte",currentPlayer);
						this.$store.dispatch('setPlayerPosition', {
							player: currentPlayer,
							i: move[1],
							j: move[0]
						});
						console.log("dupa",currentPlayer);
						let updatedPlayers = this.$store.getters.getPlayers;
						console.log("updated players", updatedPlayers);
						this.moveCurrentPlayerServer(currentPlayer, diceValue, this.$store.getters.getRoomName, this.currentPlayerIndex);
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
					return;
				}
			}
			//	console.log("current i: " + currentPlayer.i);
			//	console.log("current j: " + currentPlayer.j);
			
			//TODO cand pases in moveCurrentPlayerServer this.currentPLayerIndex el se updateaza doar dupa ce s a apasat pe 
			// done/decline challange de vazut cum sa fac sa pasez currentPlayerIndexu cum trebe
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
        },

		doneChallange() {
			this.togglePopup = false;
			this.nextAvailablePlayer();
		},

		nextAvailablePlayer() {
			this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
			let currentPlayerPoints = this.players[this.currentPlayerIndex].points
			if (currentPlayerPoints == 0) {
				while (this.players[this.currentPlayerIndex].points === 0) {
					this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
				}
			}
		},

		checkPlayerPoints(currentPlayer) {
			if (currentPlayer.points <= 0) {
				currentPlayer.points = 0; 
				currentPlayer.name = `${currentPlayer.name} eliminated :(`;
				this.eliminatedPlayersCount += 1;
		
				if (this.players.length - 1 === this.eliminatedPlayersCount) {
					for (let player of this.players) {
						if (player.points != 0) {
							console.log(player.name + " won!");
							this.disableDice = true;
						}
					}
				}
			}
		},

		moveCurrentPlayerServer(currentPlayer, diceValue, roomName, currentPlayerIndex) {
			console.log("current player", currentPlayer);
			console.log(diceValue, roomName);
			this.sockett.emit("move-current-player", currentPlayer, diceValue, roomName, currentPlayerIndex);
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


</style>