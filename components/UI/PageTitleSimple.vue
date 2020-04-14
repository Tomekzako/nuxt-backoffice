<template>
  <v-row align="center" justify="space-between">
    <v-col>
      <div class="d-flex align-center">
        <h3 class="subtitle-1 my-3">{{ title }}</h3>
        <v-spacer></v-spacer>
        <slot></slot>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    btn: {
      type: Object,
      required: false,
      default: null
    }
  },
  data: () => ({})
}
</script>
