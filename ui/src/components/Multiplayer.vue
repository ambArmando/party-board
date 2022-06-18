<template>
	<div class="centered-menu" :class="joinRoomBtnPressed || createRoomBtnPressed ? 'wide' : ''">
		<div class="row">
				<div :class="joinRoomBtnPressed || createRoomBtnPressed ? 'col-35' : 'col-100'">
					<div class="mb-4" v-if="!joinRoomBtnPressed || !createRoomBtnPressed">
					<i @click="goToMainMenu" class="fa-solid fa-arrow-left"></i>
					<h3 class="pb-1">Alătură-te unei camere</h3>
					<div class="form-group-row mt-4">
						<label class="pr-3 pb-3">Jucător:</label> 
						<input class="mr-2" type="text" placeholder="Introdu un nume..." v-model="playerName" maxlength="10" >
					</div>
					<div class="form-group-row">
						<label class="pr-3 pb-3">Cameră: </label>
						<input class="mr-2" type="text" placeholder="Numele camerei..." v-model="roomName" maxlength="10">
					</div>
					<Button class="mr-2" type="btn" @click="joinRoomBtn"> JOACĂ </Button>	

					<div class="pb-7"></div>
					
					<h3 class="pb-1">Cameră nouă</h3>
					<div class="form-group-row">
						<label class="pr-3 pb-3">Nume:</label>
						<input class="mr-2" type="text" placeholder="Numele camerei..." v-model="createRoomName" maxlength="10">
					</div>
					<Button class="mr-2" type="btn" @click="createRoom"> CAMERĂ NOUĂ </Button>	

					<div>
						<h4>{{errorMessage}}</h4>
					</div>
					
				</div>


				<div v-if="joinRoomBtnPressed || createRoomBtnPressed">	
					<div class="wrapper">
						<div class="first pt-2">
							<i class="fa-solid fa-user pl-1 mb-2 form-group-row defaultCursor"> <span> <p class="pl-3"> Jucător: {{playerName}}</p> </span> </i>
							<i class="fa-solid fa-house form-group-row defaultCursor"> <span> <p class="pl-3"> Cameră: {{roomName}}</p> </span> </i>
						</div>
						<div class="second align-right">
							<ul>
								<i class="fa-solid fa-people-roof big defaultCursor pl-4"> </i>
								<li class="pr-2" v-for="player in connectedPlayersNames" :key="player">
									<h5 class="pr-1 mt-3 mb-0">{{player}}</h5>
								</li>
							</ul>
						</div>
					</div>
					
					<div class="pb-4"></div>

					

					<div class="pb-3"></div>
				
					<div class="">	
						<h3 class="pb-0">Adaugă provocări</h3>
						<div class="form-group-row">
							<input type="text" v-model="challange" @keyup.enter="addChallange" placeholder="Provocare..." maxlength="100">
							<Button type="btn btn-icon mb-3 ml-2 pl-3 pr-3 pt-2" @click="addChallange"> <i class="fa-solid fa-plus"></i> </Button>
						</div>

						<div class="pb-3"> </div>
						<div class="form-list small fixed-height">
							<div v-for="(challange, index) in playerChallanges" :key="challange">
								<div class="form-group-row">
									<div class="pl-4 fullWidth"> <p> {{challange.text}} </p>   </div>
									<div v-if="challange.difficulty == 'Easy'">
										<p>ușor</p>
									</div>
									<div v-else-if="challange.difficulty == 'Medium'">
										<p>mediu</p>
									</div>
									<div v-else>
										<p>greu</p>
									</div>
									<div class="mr-4"></div>
									<!-- <div class="mr-4">{{challange.difficulty}}</div> -->
									<i class="fa-solid fa-pen pl-4" @click="editChallange(index, challange)"> </i> 
									<i class="fa-solid fa-xmark color-red big pl-3 ml-2 mr-1" @click="removeChallange(index)"></i>
								</div>
								<template v-if="challangeIndex === index">
									<div class="pl-3 ml-3" v-if="modifyChallange">
										<input @keyup.enter="saveModifiedChallange(index)" type="text" v-model="modifyChallangeModel" placeholder="Schimba provocarea..." maxlength="40">
										<div class="form-group-row justify-content-space-between">
											<div class="d-flex">
												<input type="radio" id="easy" value="Easy" v-model="pickedDifficulty">
												<label class="mt-1 ml-3" for="easy">ușor</label>
											</div>
											<div class="d-flex">
												<input type="radio" id="medium" value="Medium" v-model="pickedDifficulty">
												<label class="mt-1 ml-3" for="medium">mediu</label>
											</div>
											<div class="d-flex">
												<input type="radio" id="hard" value="Hard" v-model="pickedDifficulty">
												<label class="mt-1 ml-3" for="hard">greu</label>
											</div>
										</div>									
											<Button class="mb-4" type="btn" @click="saveModifiedChallange(index)"> SALVEAZĂ </Button>
									</div>
								</template>
							</div>
						</div>
						
						<div v-if="playerChallanges.length">
							<Button type="btn mt-4" @click="uploadChallanges"> INCARCĂ PROVOCĂRILE </Button>
						</div>
					</div>

					<div class="pb-4"></div>
					
					<div class="form-group-row">
						<Button type="btn mr-4" @click="startGame" :class="{disabled: disablePlay}"> JOACĂ </Button>
						<Button type="secondary-btn" @click="leaveRoom"> PĂRĂSEȘTE CAMERA </Button>
					</div>

					<div>
						<h4>{{errorMessage}}</h4>
					</div>
				</div>
	
				</div>
			<div v-if="joinRoomBtnPressed || createRoomBtnPressed" class="col-5 d-flex justify-content-center"> 
				<div class="vertical-line">

				</div>
			</div>

			<!-- Chat -->	
			<div class="col-60" v-if="joinRoomBtnPressed || createRoomBtnPressed">
				<div>
					<h3>Chat</h3>
					<div class="form-group-row">
						<input @keyup.enter="sendMessage" type="text" v-model="message" placeholder="Scrie ceva..." maxlength="50" >
						<Button type="btn btn-icon mb-3 ml-2 pl-3 pr-3 pt-2" @click="sendMessage"> <i class="fa-solid fa-paper-plane"></i> </Button>
					</div>
					<div>
						<div class="chat-box" ref="chatBoxRef">
							<ul>
								<li v-for="message in messages" :key="message">
									<!-- <div v-if="playerName === message.substring(0, message.indexOf(' '))" class="align-right width">
										{{message}}
									</div>
									<div v-else>
										{{message}}
									</div>	 -->
									{{message}}
								</li>
							</ul>
						</div>
					</div>
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
				disablePlay: true,
				challange: '',
				playerChallanges: [],
				modifyChallange: false,
				modifyChallangeModel: '',
				challangeIndex: 0,
				pickedDifficulty: 'Easy',
				//playerNameFromMessage: ''
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
			if (payload.state.players.length > 1) {
				this.disablePlay = false;
			}

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
			console.log(errorMessage);
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

		chatBox(payload) {
			console.log(payload);
			//console.log(payload.message.substring(0, payload.message.indexOf(" ")));
			//this.playerNameFromMessage = payload.message.substring(0, payload.message.indexOf(" "));

			this.messages.push(payload.message);
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
				this.errorMessage = "Alege un nume!";
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
			if (this.message.trim() !== '') {
				this.socket.emit("send-message", this.roomName, this.message);
				this.message = '';
			}
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
			} else {
				this.errorMessage = "Introdu o provocare!";
				setTimeout(()=> {
					this.errorMessage = "";	
				}, 3000);
				
			}
		},

		uploadChallanges() {
			console.log(this.playerChallanges);
			for (const challange of this.playerChallanges) {
				console.log(challange);
				if (challange.difficulty === "Easy") {
					challange.difficulty = 0;
				} else if (challange.difficulty === "Medium") {
					challange.difficulty = 1;
				} else {
					challange.difficulty = 2;
				}
			}
			this.socket.emit("add-challanges", this.playerChallanges, this.playerName);
			this.playerChallanges = [];
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
			this.pickedDifficulty = "Easy";
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

	
	ul {
		list-style-type: none;
	}

</style>