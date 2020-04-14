<template>
  <v-btn
    class="secondary px-6 mx-1 mx-md-0 ml-0 ml-md-2 font-weight-bold body-1"
    @click="clear"
    :loading="loading"
  >
    {{ $t('buttons.reset') }}
  </v-btn>
</template>

<script>
  export default {
    props: {
      loading: {
        type: Boolean,
        required: false,
        default: false
      },
      name: {
        type: String,
        required: true
      }
    },
    methods: {
      clear() {
        if (Object.keys(this.$route.query).length === 0) {
          this.$store.commit(this.name + '/SET_SEARCH', '')
          return
        }
        //this.options.sortBy.length = 0 #TODO
        this.$store.commit(this.name + '/SET_SEARCH', '')
        this.$store.commit(this.name + '/SET_LOADING_BTN2', true)
        this.$router.replace({ query: null })
      },
    }
  }
</script>