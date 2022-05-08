<template>
	<div class="container">
		<div class="content">
			<div class="items" v-if="!joinRoomBtnPressed">
				<input type="text" placeholder="Enter your name" v-model="playerName">
				<input type="text" placeholder="Room name" v-model="roomName">
				<Button color="primary" size="medium" @click="joinRoomBtn"> JOIN ROOM </Button>	
			</div>
			<div v-if="joinRoomBtnPressed">	
				<p>Player name: {{playerName}}</p>
				<p>Room name: {{roomName}}</p>
				<ul>
					Connected players:
					<li v-for="player in connectedPlayersNames" :key="player">
						{{player}}
					</li>
				</ul>
				<Button color="primary" size="medium" @click="startGame"> PLAY </Button>
				<Button color="red" size="medium"  @click="leaveRoom"> LEAVE ROOM </Button>
				<br>
				<input type="text" v-model="message">
				<button @click="sendMessage"> send message</button>
				<div class="chat-box" ref="chatBox">
					<ul>
						<li v-for="message in messages" :key="message">
							{{message}}
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import Button from './buttons/Button.vue'
import {io} from 'socket.io-client'
export default {

	components: {
        Button
    },

	data() {
			return {
				roomName: "",
				playerName: "",
				message: "",
				joinRoomBtnPressed: false,
				socket: io('http://localhost:3000'),
				messages: [],
				id: 0,
				connectedPlayers: [],
				playersColors: [],
				randomColors: ['fuchsia', 'purple', 'lightBlue', 'lightgreen', 'tan', 'yellow', 'teal', 'indigo'],
			}
		},

	mounted() {
		this.socket.on("receive-message", message => {
			console.log("receive", message);
			this.messages.push(message);
			this.$nextTick( () => {
				var chatBox = this.$refs.chatBox;
				chatBox.scrollTop = chatBox.scrollHeight; 
			});
		});

		// this.socket.on("update-current-player", (currentPlayer) => {
		// 	console.log("current player venit de la server catre room", currentPlayer);
		// });

		this.socket.on("player-list", data => {
			console.log(data);
			//this.connectedPlayersNames = data;
			this.$store.dispatch('setConnectedPlayers', data);
		});

		this.socket.on("player-joined", player => {
			this.messages.push(player + " joined the room");
			this.connectedPlayersNames.push(player);
		});

		this.socket.on("player-left", player => {
			this.messages.push(player + " left the room");
			for (let i = 0; i < this.connectedPlayersNames.length; i++) {
				if (this.connectedPlayersNames[i] === player) {
					console.log("split aici", this.connectedPlayersNames[i]);
					this.connectedPlayersNames.splice(i, 1)
				}
			}
		});

		this.socket.on("full-room", () => {
			this.joinRoomBtnPressed = false;
		});

		this.socket.on('start-game', async (players, playersColors) => {
			//await this.addPlayers(players);
			console.log("player array u", players);
			console.log("playerC array u", playersColors);

			//promise
		    // let promise = this.setPlayersColor(players);
			// promise.then((result) => {
			// 	console.log(result);
			// })

			//await
			// console.log("inaite de await", this.playersColors);
			// await this.setPlayersColor(players);
			// console.log("dupa de await", this.playersColors);

			for (let [index, player] of players.entries()) {
				this.connectedPlayers.push({
					id: this.getID(),
                	name: player,
                	points: 1000,
                	color: playersColors[index],
                	i: null,
                	j: null,
                	lastI: null,
                	lastJ: null
				});
			}
			console.log("conn players", this.connectedPlayers);
			this.$store.dispatch('setPlayersArray', this.connectedPlayers);
			this.$store.dispatch('setRoom', this.roomName);
			this.$router.push('board');
		});

	},

	computed: {
		...mapGetters({
			connectedPlayersNames: 'getRoomPlayers',
		}) 
	},

	methods: {
		joinRoomBtn() {
			this.socket.emit("join-room", this.roomName, this.playerName); 
			this.joinRoomBtnPressed = !this.joinRoomBtnPressed;
			//this.socket.emit("get-connected-players", this.roomName);
			
		},

		leaveRoom() {
			this.joinRoomBtnPressed = !this.joinRoomBtnPressed;
			this.socket.emit("leave-room", this.roomName, this.playerName);
			this.text = "";
		},

		sendMessage() {
			this.socket.emit("send-message", this.message, this.roomName, this.playerName);
		},

		startGame() {
			console.log(this.connectedPlayersNames, this.roomName);
			for (let i = 0; i < this.connectedPlayersNames.length; i++) {
				this.playersColors.push(this.getRandomColor());
			}
			this.socket.emit("start-game", this.connectedPlayersNames, this.roomName, this.playersColors);
		},

		getID() {
			return this.id++;
		},

		getRandomColor() {
            var randomNumber = Math.floor(Math.random() * this.randomColors.length);
            let randomColor = this.randomColors[randomNumber];
            this.randomColors.splice(randomNumber, 1)
            return randomColor;
        },

		// addPlayers(players) {
		// 	this.connectedPlayers.push({
        //     	id: this.getID(),
        //         name: '',
        //         points: 1000,
        //         color: this.getRandomColor(),
        //         i: null,
        //         j: null,
        //         lastI: null,
        //         lastJ: null
        //     });
		// }

		setPlayersColor(players) {
			return new Promise((resolve, reject) => {
				for (let i = 0; i < players.length; i++) {
					this.playersColors.push(this.getRandomColor());
				}
				resolve(this.playersColors);
			});
			
		},

	}

}
</script>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;	
	}

	.items {
		padding: 30px;
		margin: 10px;
	}

	.content {
		background-color: #EFD9CE;
		width: 30rem;
		height: 30rem;
		padding: 20px;
	}

	input {
		display: block;
		height: 20px;
		margin-bottom: 10px;
		width: 100%;
	}

	.chat-box {
		height: auto;
		overflow-y: auto;
		height: 150px;
	}

	ul {
		list-style-type: none;
	}

</style>