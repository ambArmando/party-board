<template>
  <div class="container">
    <header></header>
    <aside>
      <table>
        <tr v-for="player in players" :key="player">
          <td>
            <span>{{ player.name }} <span :class="player.color"><p>{{ player.color }}</p></span> <br /></span> 
            Points: {{ player.points }}
          </td>
        </tr>
      </table>
    </aside>
    <main>
      <BoardVue/>
    </main>
  </div>
</template>

<script>
import BoardVue from "./Board.vue";

export default {

  components: {
    BoardVue
  },    

  data: () => ({
    players: [],
    board: null,
    canvasWidth: 0,
    canvasHeight: 0,
  }),

  mounted() {
    this.players = this.$store.getters.getPlayers;
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
        &.indigo {
          color: #4b0082;
        }
        &.teal {
          color: #008080;
        }
        &.purple {
          color: #4606ad;
        }
        &.fuchsia {
          color: #fc28fb;
        }
        &.lightBlue {
          color: #00b4d8;
        }
        &.lightgreen {
          color: #11746a;
        }
        &.tan {
          color: #d2b48c;
        }
        &.yellow {
          color: #fffb14;
        }
      }
    }
  }
}

span {
  p {
      display: inline;
      font-size: 18px;
      font-weight: 500;
      font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
	  
      padding: 4px;
      &.indigo {
        color: #4b0082;
      }
      &.teal {
        color: #008080;
      }
      &.purple {
        color: #4606ad;
      }
      &.fuchsia {
        color: #fc28fb;
      }
      &.lightBlue {
        color: #00b4d8;
      }
      &.lightgreen {
      color: #11746a;
      }
      &.tan {
        color: #d2b48c;
      }
      &.yellow {
        color: #fffb14;
      }
    }
  }
</style>