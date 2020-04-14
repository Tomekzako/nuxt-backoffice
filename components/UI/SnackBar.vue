<template>
  <v-snackbar top :timeout="time" v-model="visible" :color="color" class="body-1">
    {{ text }}
    <v-btn text @click="visible = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      text: 'snackbar/getText',
      color: 'snackbar/getColor',
      time: 'snackbar/getTime'
    }),
    visible: {
      get() {
        return this.$store.getters['snackbar/getVisible']
      },
      set(value) {
        this.$store.commit('snackbar/hideSnackbar')
      }
    }
  }
}
</script>