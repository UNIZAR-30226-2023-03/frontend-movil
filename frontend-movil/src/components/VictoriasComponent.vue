<script>
export default {
  props: {
    show: Boolean
  },
  data() {
    return {
      players: [
        { name: "Player 1", wins: 3 },
        { name: "Player 2", wins: 5 },
        { name: "Player 3", wins: 1 },
        { name: "Player 1", wins: 3 },
        { name: "Player 2", wins: 5 },
        { name: "Player 3", wins: 1 },
        { name: "Player 1", wins: 3 },
        { name: "Player 2", wins: 5 },
        { name: "Player 3", wins: 1 },
        { name: "Player 1", wins: 3 },
        { name: "Player 2", wins: 5 },
        { name: "Player 2", wins: 5 },
        { name: "Player 3", wins: 1 },
        { name: "Player 1", wins: 3 },
        { name: "Player 2", wins: 5 },
        { name: "Player 3", wins: 1 },
        { name: "Player 1", wins: 3 },
        { name: "Player 2", wins: 5 },
        { name: "Player 3", wins: 1 },
        { name: "Player 1", wins: 3 },
        { name: "Player 2", wins: 5 },
        { name: "Player 2", wins: 5 },
        { name: "Player 3", wins: 1 },
        { name: "Player 1", wins: 3 },
        { name: "Player 2", wins: 5 },
        { name: "Player 3", wins: 1 },
        { name: "Player 1", wins: 3 },
        { name: "Player 2", wins: 5 },
        { name: "Player 3", wins: 1 },
        { name: "Player 1", wins: 3 },
        { name: "Player 2", wins: 5 },
        { name: "Player 2", wins: 5 },
        { name: "Player 3", wins: 1 },
        { name: "Player 1", wins: 3 },
        { name: "Player 2", wins: 5 },
        { name: "Player 3", wins: 1 },
        { name: "Player 1", wins: 3 },
        { name: "Player 2", wins: 5 },
        { name: "Player 3", wins: 1 },
        { name: "Player 1", wins: 3 },
        { name: "Player 2", wins: 5 },
        { name: "Player 2", wins: 5 },
        { name: "Player 3", wins: 1 },
        { name: "Player 1", wins: 3 },
        { name: "Player 2", wins: 5 },
        { name: "Player 3", wins: 1 },
        { name: "Player 1", wins: 3 },
        { name: "Player 2", wins: 5 },
        { name: "Player 3", wins: 1 },
        { name: "Player 1", wins: 3 },
        { name: "Player 2", wins: 5 },
        { name: "Player 3", wins: 1 },
        { name: "Player 4", wins: 2 },
        { name: "Player 5", wins: 4 }
      ]
    }
  },
  methods: {
    // Any additional methods you need can be defined here
  }
}
</script>

<template>
  <Transition name="victorias">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <a class="close-icon-img" @click="$emit('close')">
          <img src="../../public/assets/close.png" alt="cerrar popup">
        </a>
        <div id="tabla">
          <table>
            <thead>
              <tr>
                <th>Jugador</th>
                <th>Victorias</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(player, index) in players" :key="index">
                <td>{{ player.name }}</td>
                <td>{{ player.wins }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
@import '../theme/estilos.css';
</style>
