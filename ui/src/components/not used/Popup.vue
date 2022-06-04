<template>
    <div class="popup">
        <div class="popup-inner">
            <slot />
            <button>
                Done challange
            </button>
            <button @click="togglePopups" class="popup-close">
                Decline challange
            </button>
        </div>
    </div>
  
</template>

<script>
// NU MAI ESTE FOLOSIT !!
import { mapGetters } from 'vuex';
export default {
    
    // props: {
    //     onYes: {
    //         type: Object, 
    //         requiered: true
    //     },
    //     onNo: {
    //         type: Object,
    //         requiered: false
    //     }
    // },

    computed: {
        ...mapGetters({
            players: 'getPlayers',
            currentPlayerIndex: 'getCurrentPlayerIndex'
        })
    },
    
    methods: {

        togglePopups() {
            //TODO de scazut puncte in functie de dificultatea challangelui
            console.log(this.players);
            for (let player of this.players) {
                if (player.id === this.players[this.currentPlayerIndex].id) {
                    player.points -= 100;
                }
            }
            this.$store.dispatch('togglePopup', false);
        }

    }
}
</script>

<style lang="scss" scoped>

.popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.2);

    display: flex;
    align-items: center;
    justify-content: center;

    .popup-inner {
        background-color: #FFF;
        padding: 32px;
    }
}

</style>