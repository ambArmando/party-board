<template>
    <div class="centered-menu center-vertically-absolute">
        <h3 class="text mt-4 pb-4">PARTY BOARD</h3>
            <!--<table>
                <tr v-for="(player, index) in players" :key="player" >
                    <td> <p>PLAYER {{index + 1}} -</p> </td>
                    <td> <input type="text" placeholder=" Enter your name" v-model="player.name"></td>
                    <td v-if="players.length < 3 ? false : true" @click="removePlayerById(player.id)" class=""> X </td>
                </tr>
            </table>-->

            <div class="form-group-row mb-3" v-for="(player, index) in players" :key="player" >
                    <label class="pr-3">PLAYER {{index + 1}}:</label> 
                    <input class="mr-2" type="text" placeholder=" Enter your name" v-model="player.name">
                    <i  v-if="players.length < 3 ? false : true" @click="removePlayerById(player.id)" class="fa-solid fa-xmark color-red big"></i>
            </div>

            <div class="pb-4"></div>

            <Button class="mb-1 pr-2" @click="addNewPlayer" :disabled="isDisabled" type="btn"> ADD PLAYER </Button>
            <Button class="mb-1 pr-2" v-if="players.length < 3 ? false : true" @click="removePLayer" type="btn">REMOVE PLAYER</Button>
            <Button  class="mb-5 pr-2" type="btn" @click="multiplayerBtnHandler"> MULTIPLAYER </Button>
            <Button  class="mb-1 pr-2" type="secondary-btn" @click="playButtonHandler">PLAY!</Button> 

            <Button class="pr-2" type="btn" @click="toggleHowToPlay">HOW TO PLAY</Button>
            <div v-show="showHowToPlay" class="">   
                <p>{{howToPlayText}}</p> 
                <p>Green - easy challange</p>
                <p>Orange - medium challange</p>
                <p>Red - hard challange</p>
            </div>
            <div class="pb-3"></div>
    </div>
</template>

<script>
import Button from './buttons/Button.vue';

export default {
    name: 'MainMenu',

    components: {
        Button
    },

    data() {
        return {
            isDisabled: false,
            showHowToPlay: false,
            players: [],
            id: 0,
            isMultiplayer: false,
            randomNames: ['bottle', 'water', 'camera', 'stamp', 'postcard', 'pencil', 'file', 'candy', 'potato', 'onion', 'leaf', 'coin', 'mop', 'key'],
            randomColors: ['fuchsia', 'purple', 'lightBlue', 'lightgreen', 'tan', 'yellow', 'teal', 'indigo'],
            howToPlayText: 'Spin the dice and move to a square, depending on the box color a challange will pop up. Players have the ability to decline the challange but doing this will make them lose points. If the points get to 0 the player will be eliminated. '
        }
    },

    mounted() {
        this.addNewPlayer();
        this.addNewPlayer();
        console.log(this.players);
    },

    methods: {

        getRandomName() {
            let randomNumber = Math.floor(Math.random() * this.randomNames.length);
            let randomName = this.randomNames[randomNumber] + Math.floor(Math.random() * 100);
            this.randomNames.splice(randomNumber, 1);
            return randomName;
        },

        getRandomColor() {
            let randomNumber = Math.floor(Math.random() * this.randomColors.length);
            let randomColor = this.randomColors[randomNumber];
            this.randomColors.splice(randomNumber, 1)
            return randomColor;
        },

        getID() {
            return this.id++;
        },

        addNewPlayer() {
            if (this.players.length > 7) {
                console.log("no more players");
                this.isDisabled = true;
            } else {
                this.players.push({
                    id: this.getID(),
                    name: '',
                    points: 100,
                    color: this.getRandomColor(),
                    i: null,
                    j: null,
                    lastI: null,
                    lastJ: null
                });
            }
        },

        removePlayerById(id) {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].id === id) {
                    this.players.splice(i, 1);
                    return;
                }
            }
        },

        removePLayer() {
            this.players.pop();
            this.isDisabled = false;
        },

        toggleHowToPlay() {
            this.showHowToPlay = !this.showHowToPlay;
        },

        playButtonHandler() {

            for (var i = 0; i < this.players.length; i++) {
                if (this.players[i].name === '') {
                    this.players[i].name = this.getRandomName()
                }
            }

            this.$store.dispatch('setIsMultiplayer', false);
            this.$store.dispatch('setPlayersArray', this.players);
            this.$router.push('board');
        },

        multiplayerBtnHandler() {
            this.$store.dispatch('setIsMultiplayer', true);
            this.$router.push('multiplayer');
        }
    },
}
</script>

<style lang="scss" scoped>


.mainMenu {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    position: relative;
    background-color: #EFD9CE;
    width: 30rem;
    height: 30rem;
    margin-top: 15px;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 1px 2px grey;
    overflow-y: auto;
    overflow-x: hidden;
}

.spacer {
    flex-grow: 1;
}

.text {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
}

td {
  padding: 0.5rem;
}

table {
    width: 100%;
    margin-bottom: 30px;
    tr {
        td {
            text-align: center; 

            &.crossSign {
                cursor: pointer;
                color: red;
                
            }
        }
    }
}

input {
    width: 100%;
    height: 30px;
    border: solid 1px grey;
}

.btnPlay {
    margin-top: 2rem;
}

.howToPlay {
    position: absolute;
    bottom: 0;
    margin-bottom: 1rem;
    font-size: 24px;
    font-weight: bold;
    padding: 0;
}

.howToPlayText {
    position: absolute;
    font-size: 18px;
    margin-left: 10px;
    background-color: white;
    padding: 5px;
    padding-left: 10px;
    border-radius: 3px;

}

.howToPlayPositionRelative {
    position: relative;
    margin-top: 5rem;
}

</style>