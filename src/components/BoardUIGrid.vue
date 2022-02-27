<template>
  <div class="container">
    <header></header>
    <aside>
      <table>
        <tr v-for="player in players" :key="player">
          <td>
            {{ player.name }}
            <span :class="player.color">{{ player.color }}</span> <br />
            Points: {{ player.points }}
          </td>
        </tr>
      </table>
    </aside>
    <main>
      <div class="board-wrapper" ref="wrapper">
        <p v-for="player in players" :key="player" :class="player.color">
          {{ player.color }}
        </p>
        <canvas id="board"> </canvas>
      </div>
      <div>
        <button class="dice" ref="dice" :class="{'clicked': clicked}">dice</button>
      </div>
    </main>
  </div>
</template>

<script>
import Board from "./Board.js";

export default {
  data: () => ({
    players: [],
    board: null,
    canvasWidth: 0,
    canvasHeight: 0,
    clicked: false,
  }),

  mounted() {
    this.players = this.$store.getters.getPlayers;
    var canvas = document.getElementById("board");
    setTimeout(() => {
      this.board = new Board(canvas, this.$refs.wrapper, this.$refs.dice);
      this.board.start();
    }, 2000);
    
  },

  methods: {
    getRandomNumber() {
      this.clicked = !this.clicked;
      return Math.ceil(Math.random() * 6);
    },
  },
};
</script>

<style lang="scss" scoped>
html,
body {
  height: 100%;
  margin: 0;
}

.container {
  height: 100%;
  display: grid;
  grid-template-rows: 45px 1fr;
  grid-template-columns: 200px 1fr;
}

.dice {
  cursor: pointer;
  width: 124px;
  height: 124px;
  background: rgb(226, 226, 226);
  margin-top: 20px;
  padding: 0;
  border: 1;
}

header {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.16);
  grid-column: 1/-1;
}

aside {
  background-color: #d8e6e3;
  height: 100vh;
}

.board-wrapper {
  display: inline-block;
  width: 75%;
  height: 100vh;
  padding: 15px;
}

main {
  display: flex;
}

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
        &.purple {
          color: #573391;
        }
        &.pink {
          color: #fc28fb;
        }
        &.lightBlue {
          color: #00b4d8;
        }
        &.teal {
          color: #11746a;
        }
        &.peach {
          color: #ffaaa5;
        }
        &.beige {
          color: #d29d2b;
        }
      }
    }
  }
}

p {
    display: inline;
    font-size: 24px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    padding: 4px;
  &.red {
    color: red;
  }
  &.blue {
    color: blue;
  }
  &.purple {
    color: #573391;
  }
  &.pink {
    color: #fc28fb;
  }
  &.lightBlue {
    color: #00b4d8;
  }
  &.teal {
    color: #11746a;
  }
  &.peach {
    color: #ffaaa5;
  }
  &.beige {
    color: #d29d2b;
  }
}
</style>