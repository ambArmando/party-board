<template>
    <div class="container">
        <div class="gameInfoBar">
            <table>
                <tr v-for="(player, index) in players" :key="index"> 
                    <td> {{player.name}} <span :class="player.color">{{player.color}}</span> <br> Points: {{player.points}}</td>
                </tr>
            </table>
        </div>
        <div class="board-wrapper" ref="wrapper">
            <canvas id="board"> </canvas>
        </div>
    </div> 
</template>

<script>
import Board from './Board.js';

export default {
  components: {  },

    data: () => ({
        players: [],
        vueCanvasCtx: null,
        canvasWidth: 0,
        canvasHeight: 0,
        boardSquares: [],
        id: 0,
        board: null
    }),

    mounted() {
        this.players = this.$store.getters.getPlayers;
        var canvas = document.getElementById("board");
        // var heightRatio = 0.5;
        // console.log(canvas.width);
        // canvas.height = canvas.width * heightRatio;
        // console.log(canvas.height + " canvas.height ");
        //var ctx = canvas.getContext("2d");
        //this.vueCanvasCtx = ctx;
        // this.canvasWidth = canvas.width;
        // this.canvasHeight = canvas.height;
        this.board = new Board(canvas, this.$refs.wrapper);
        this.board.start();
    },

    methods: {
        drawBoard() {
          
        },

        clearBoard() {
            this.vueCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        },

        getId() {
            return this.id++;
        },

        getChallange() {
            return "challange in functie de culoare pentru patratul cu id-ul " + this.id;
        },

        getSquare() {
            //getRandomNumber() - asta e zarul
            for (let i = 0; i < this.boardSquares.length; i++) {
                if (this.boardSquares[i].id === 0) {
                    console.log(this.boardSquares[i].challange);
                    //pop up cu fereastra de challange
                    //se muta playerul pe canvas
                    //se salveaza noul squareId pentru playerul curent
                }
            } 
        }
    }
}
</script>

<style lang="scss" scoped>

    .container {
        width: 100%;
        height: 100%;
        display: block;
        background-color: white;
    }

    

    .board-wrapper {
        display: inline-block;
        width: 75%;
        height: 100vh;
        background-color: red;
    }

    #board {
        background-color: rgb(238, 236, 236);
        
    }

    .gameInfoBar {
        display: inline-block;
        height: 100vh;
        width: 14rem;
        background-color: #d8e6e3;
        border-right: 1px solid rgb(226, 224, 224);
        table {
            width: 14rem;
            padding: 15px;
            tr {
                td {
                    text-align: center;
                    padding: 20px;

                    span {
                        &.red {
                            color: red;
                        }
                        &.blue {
                            color: blue;
                        }
                        &.purple{
                            color: #573391;
                        }
                        &.pink {
                            color: #FC28FB;
                        }
                        &.lightBlue {
                            color: #00B4D8;
                        }
                        &.teal {
                            color: #11746a;
                        }
                        &.peach {
                            color: #FFAAA5;
                        }
                        &.beige {
                            color: #D29D2B;
                        }
                    }
                }
            }
        }
    }

</style>