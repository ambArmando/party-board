import { createSimpleExpression } from 'vue/node_modules/@vue/compiler-core';
import store from '../store'

export default class Board {
    
    constructor(canvas, wrapper, dice) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.grid = [
                     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                     [1, 0, 0, 1, 1, 1, 1, 0, 0, 0], 
                     [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
                     [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                     [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
                     [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
                     [1, 0, 1, 1, 1, 1, 0, 0, 0, 0],
                     [1, 0, 1, 0, 0, 1, 0, 0, 0, 0],
                     [1, 1, 1, 0, 0, 1, 1, 1, 1, 1]];

        this.wrapper = wrapper;
        this.dice = dice;
        console.log(this.dice.classList);
        console.log(this.dice);
        
    }

    computeSquareSize() {
        let size = Math.min(this.canvasWidth, this.canvasHeight);
        this.squareSize = size / (this.grid[0].length + 2);
    }

    update() {
        let rect = this.wrapper.getBoundingClientRect();
        this.canvasWidth = rect.width;
        this.canvasHeight = rect.height;
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight - 10;
        this.computeSquareSize();

    }

    render() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.renderBoard();
        //this.renderPlayers();
        this.renderDebug();
    }

    renderDebug() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(`width: ${this.canvasWidth} height: ${this.canvasHeight}`, 10, 10);
    }

    renderBoard() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                let square = this.grid[i][j];
                if (i === 0 && j === 0 || i === 9 && j === 9) {
                    this.ctx.fillStyle = 'orange'; //finish and start line
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
    }

    renderPlayers() {
        const players = store.getters.getPlayers; 
        players.forEach((player) => {
            let diceClicked = this.dice.classList.contains('clicked');
            if (!diceClicked) {
                setTimeout(() => {
                    alert("spin dice!");
                }, 3000);
            } else {
               // this.dice.classList.add('clicked');
            }
           // const diceValue = this.getRandomNumber();

        });
        
    }

    // getRandomNumber() {
    //     return Math.ceil(Math.random() * 6);
    // }

    computeChallange() {
    }

    start() {
        this.update();
        this.render();
        window.requestAnimationFrame(this.start.bind(this));    
    }

   

}