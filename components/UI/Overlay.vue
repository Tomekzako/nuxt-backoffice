<template>
  <v-overlay :value="visible" :opacity="opacity">
    <v-row class="fill-height" align-content="center" justify="center">
      <v-col class="subtitle-1 text-center" cols="12">{{ text }}</v-col>
      <v-col cols="6" class="text-center">
        <v-progress-linear v-if="type === 'linear'" :color="color" indeterminate rounded height="6"></v-progress-linear>
        <v-progress-circular v-if="type === 'circular'" indeterminate size="64"></v-progress-circular>
      </v-col>
    </v-row>
  </v-overlay>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      visible: 'overlay/getVisible',
      text: 'overlay/getText',
      color: 'overlay/getColor',
      type: 'overlay/getType',
      opacity: 'overlay/getOpacity'
    })
  }
}
</script>

<style>
</style>