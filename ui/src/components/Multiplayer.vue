<template>
	<div class="container">
		<div class="content">
			<div class="items" v-if="!joinRoomBtnPressed || !createRoomBtnPressed">
				<input type="text" placeholder="Enter your name" v-model="playerName">
				<input type="text" placeholder="Room name" v-model="roomName">
				<Button color="primary" size="medium" @click="joinRoomBtn"> JOIN ROOM </Button>	
				<input type="text" placeholder="Room name" v-model="createRoomName">
				<Button color="primary" size="medium" @click="createRoom"> CREATE ROOM </Button>	

				<p>{{errorMessage}}</p>
			</div>
			<div v-if="joinRoomBtnPressed || createRoomBtnPressed">	
				<p>Player name: {{playerName}}</p>
				<p>Room name: {{roomName}}</p>
				<ul>
					Connected players:
					<li v-for="player in connectedPlayersNames" :key="player">
						{{player}}
					</li>
				</ul>
				<Button color="primary" size="medium" @click="startGame" :class="{disabled: disablePlay}"> PLAY </Button>
				<Button color="red" size="medium"  @click="leaveRoom"> LEAVE ROOM </Button>
				<br>
				<input type="text" v-model="message" placeholder="Type something...">
				<button @click="sendMessage"> send message</button>
				<br>
				<div>	
					{{pickedDifficulty}}
					<input type="text" v-model="challange" placeholder="Baga provocare...">
					<table>
						<tr v-for="(challange, index) in playerChallanges" :key="challange">
							<td> {{challange.text}} {{challange.difficulty}} </td>
							<td @click="editChallange(index, challange)"> edit </td>
							<div v-if="challangeIndex === index">
								<td v-if="modifyChallange"> <input type="text" v-model="modifyChallangeModel" placeholder="Schimba provocarea..."> <button @click="saveModifiedChallange(index)"> schimba </button> </td>
								<td v-if="modifyChallange">
									<input type="radio" id="easy" value="easy" v-model="pickedDifficulty">
									<label for="easy">Easy</label>
									<input type="radio" id="medium" value="medium" v-model="pickedDifficulty">
									<label for="medium">Medium</label>
									<input type="radio" id="hard" value="hard" v-model="pickedDifficulty">
									<label for="hard">Hard</label>
								</td>
							</div>
							<td @click="removeChallange(index)"> X </td>
						</tr>
					</table>
					<button @click="addChallange"> add </button>
					<button @click="uploadChallanges"> Incarca provocarile </button>
				</div>
				<!-- {{connectedPlayers}} -->
				<div class="chat-box" ref="chatBoxRef">
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
				createRoomName: "",
				playerName: "",
				message: "",
				joinRoomBtnPressed: false,
				createRoomBtnPressed: false,
				socket: io('http://localhost:3000'),
				messages: [],
			//	id: 0,
				connectedPlayers: [],
				//playersColors: [],
				connectedPlayersNames: [],
				//randomColors: ['fuchsia', 'purple', 'lightBlue', 'lightgreen', 'tan', 'yellow', 'teal', 'indigo'],
				errorMessage: '',
				disablePlay: false,
				challange: '',
				playerChallanges: [],
				modifyChallange: false,
				modifyChallangeModel: '',
				challangeIndex: 0,
				pickedDifficulty: 'easy',
			}
		},

	mounted() {

		this.$store.dispatch('setSocket', this.socket);

		this.socket.on("state-update", (payload) => {
			console.log("ni payloadu", payload);
			this.joinRoomBtnPressed = true;
			this.createRoomBtnPressed = true;
			this.connectedPlayers = payload.state.players;
			this.populatePlayerNamesArray(payload.state.players);
			//asta trebuie pus inapoi
			// if (payload.state.players.length > 1) {
			// 	this.disablePlay = false;
			// }

			if (payload.event === "start-game") {
				this.$store.dispatch('setPlayersArray', this.connectedPlayers);
				this.$store.dispatch('setCurrentGameState', payload.state);
				this.$router.push('board');
			}
		});

		this.socket.on("new-message", (payload) => {
			this.chatBox(payload);
		})

		this.socket.on("error-message", (errorMessage) => {
			this.errorMessage = errorMessage;
			setTimeout(()=> {
				this.errorMessage = "";
			}, 3000);
		});

		this.socket.on("s-player-data", (playerData) => {
			this.$store.dispatch('setThisPlayer', playerData);
				console.log("Store player data", playerData);
		});

	},

	computed: {
		...mapGetters({
			//connectedPlayersNames: 'getRoomPlayers',
		}) 
	},

	methods: {

		populatePlayerNamesArray(players) {
			this.connectedPlayersNames = [];
			console.log(players)
			for (let player of players) {
				this.connectedPlayersNames.push(player.name);
			}
		},

		chatBox(msg) {
			console.log(msg);
			// if (payload.optionalMessage !== undefined) {
			// 	this.messages.push(payload.optionalMessage);
			// }
			this.messages.push(msg);
			this.$nextTick( () => {
				let chatBoxRef = this.$refs.chatBoxRef;
				if (chatBoxRef !== undefined) {
					chatBoxRef.scrollTop = chatBoxRef.scrollHeight;
				}	
			});
		},

		joinRoomBtn() {
			this.$store.dispatch('setIsMultiplayer', true);
			this.$store.dispatch('setRoom', this.roomName);
			this.socket.emit("join-room", this.roomName, this.playerName); 
		},

		createRoom() {
			this.roomName = this.createRoomName
			this.$store.dispatch('setIsMultiplayer', true);
			this.$store.dispatch('setRoom', this.roomName);
			if (this.playerName.trim() === "") {
				this.errorMessage = "Please pick a name!";
				setTimeout(()=> {
					this.errorMessage = "";
				}, 3000);
			} else {
				this.socket.emit("create-room", this.createRoomName, this.playerName);
			}
		},

		leaveRoom() {
			this.joinRoomBtnPressed = !this.joinRoomBtnPressed;
			this.createRoomBtnPressed = !this.createRoomBtnPressed
			this.socket.emit("leave-room", this.roomName, this.playerName);
			this.messages = [];
		},

		sendMessage() {
			this.socket.emit("send-message", this.roomName, this.message);
			this.message = '';
		},

		startGame() {
			this.socket.emit("start-game",  this.roomName);
		},

		addChallange() {
			if (this.challange.trim() !== "") {
				this.playerChallanges.push({
					text: this.challange,
					difficulty: this.pickedDifficulty,
				});
				this.challange = "";
			}
		},

		uploadChallanges() {
			this.socket.emit("add-challanges", this.playerChallanges);
		},

		removeChallange(index) {
			console.log("remove challange: ", index);
			for (let i = 0; i < this.playerChallanges.length; i++) {
				if (i === index) {
					this.playerChallanges.splice(i, 1)
				}
			}
			this.modifyChallange = false;
		},

		editChallange(index, challange) {
			this.challangeIndex = index;
			for (let i = 0; i < this.playerChallanges.length; i++) {
				if (i === index) {
					this.modifyChallange = true;
					this.modifyChallangeModel = challange.text;
				}
			}
		},

		saveModifiedChallange(index) {
			for (let i = 0; i < this.playerChallanges.length; i++) {
				if (i === index && (this.modifyChallangeModel.trim() !== "")) {
					this.playerChallanges[i].text = this.modifyChallangeModel;
					this.playerChallanges[i].difficulty = this.pickedDifficulty;
				}
			}
			this.modifyChallange = false;
			this.pickedDifficulty = "easy";
		}

		// getID() {
		// 	return this.id++;
		// },

		// getRandomColor() {
        //     var randomNumber = Math.floor(Math.random() * this.randomColors.length);
        //     let randomColor = this.randomColors[randomNumber];
        //     this.randomColors.splice(randomNumber, 1)
        //     return randomColor;
        // },
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

	.disabled{
		pointer-events: none;
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