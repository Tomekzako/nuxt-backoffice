<template>
  <v-dialog v-model="show" :max-width="options.width" :style="{ zIndex: options.zIndex }" @keydown.esc="cancel" class="confirm">
    <v-card>
      <v-toolbar :color="options.color" dark dense flat>
        <v-toolbar-title class="white--text confirm__title">{{ title }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text v-show="!!message" class="pa-4">
        <p class="my-2 confirm__text">
          {{ message }}
        </p>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn small class="primary py-1 px-6 ml-2 font-weight-bold body-1" @click="action(true)">
          {{ $t('buttons.yes') }}
        </v-btn>
        <v-btn small class="secondary py-1 px-6 ml-2 font-weight-bold body-1" @click="action(false)">
          {{ $t('buttons.cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    message: null,
    title: null,
    options: {
      color: 'accent',
      width: 340,
      zIndex: 200
    }
  }),
  computed: {
    show: {
      get() {
        return this.dialog
      },
      set(value) {
        this.dialog = value
        if (value === false) {
          this.action(false)
        }
      }
    }
  },
  methods: {
    open(title, message, options) {
      this.dialog = true
      this.title = title
      this.message = message
      this.options = Object.assign(this.options, options)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    action(type) {
      this.resolve(type)
      this.dialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.confirm {
  &__title {
    font-size: 18px;
  }
  &__text {
    line-height: 1.4;
    font-size: 14px;
  }
}
</style>
