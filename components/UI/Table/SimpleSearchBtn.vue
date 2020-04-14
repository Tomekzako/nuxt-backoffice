<template>
  <v-btn
    class="primary px-6 mx-1 mx-md-0 mb-2 mb-md-0 ml-0 ml-md-2 font-weight-bold body-1"
    @click="filter"
    :loading="loading"
    :disabled="disabled"
  >
    {{ $t('buttons.search') }}
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
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      search: {
        type: String,
        required: false,
        default: ''
      },
      name: {
        type: String,
        required: true
      }
    },
    methods: {
      filter() {
        if (this.$route.query.search) {
          const queryArr = this.$route.query.search.replace(/[\[\]']+/g, '').split('=')
          if (this.search !== queryArr[1]) {
            this.$store.commit(this.name + '/SET_LOADING_BTN', true)
            const URL = `name=${this.search}`
            this.$router.push({ query: { search: URL } })
          }
        } else {
          this.$store.commit(this.name + '/SET_LOADING_BTN', true)
          const URL = `name=${this.search}`
          this.$router.push({ query: { search: URL } })
        }
      }
    }
  }
</script>