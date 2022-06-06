<template>
	<div class="centered-menu center-vertically-absolute">
			<div class="mb-4" v-if="!joinRoomBtnPressed || !createRoomBtnPressed">
				<i @click="goToMainMenu" class="fa-solid fa-arrow-left"></i>
				<h3 class="pb-1">Join a room</h3>
				<div class="form-group-row mt-4">
					<label class="pr-3 pb-3">Player:</label> 
					<input class="mr-2" type="text" placeholder="Enter your name" v-model="playerName">
				</div>
				<div class="form-group-row">
					<label class="pr-3 pb-3">Room: </label>
					<input class="mr-2" type="text" placeholder="Room name" v-model="roomName">
				</div>
				<Button class="mr-2" type="btn" @click="joinRoomBtn"> JOIN ROOM </Button>	

				<div class="pb-7"></div>
				
				<h3 class="pb-1">Create a room</h3>
				<div class="form-group-row">
					<label class="pr-3 pb-3">Name:</label>
					<input class="mr-2" type="text" placeholder="Room name" v-model="createRoomName">
				</div>
				<Button class="mr-2" type="btn" @click="createRoom"> CREATE ROOM </Button>	

				<div>
					<h4>{{errorMessage}}</h4>
				</div>
				
			</div>
			<div v-if="joinRoomBtnPressed || createRoomBtnPressed">	

				<div class="">
					<i class="fa-solid fa-user pl-1 mb-2 form-group-row defaultCursor"> <span> <p class="pl-3">{{playerName}}</p> </span> </i>
					<i class="fa-solid fa-house form-group-row defaultCursor"> <span> <h4 class="pl-3">{{roomName}}</h4> </span> </i>
				</div>
				<div class="align-right">
					<ul class="pl-0">
						<i class="fa-solid fa-people-roof big defaultCursor"> </i>
						<li class="pr-2" v-for="player in connectedPlayersNames" :key="player">
							<h5 class="pr-1">{{player}}</h5>
						</li>
					</ul>
					
				</div>
				
			
				<Button type="btn mb-2" @click="startGame" :class="{disabled: disablePlay}"> PLAY </Button>
				<Button type="secondary-btn" @click="leaveRoom"> LEAVE ROOM </Button>
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
		},

		goToMainMenu() {
			this.$router.push('/');
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