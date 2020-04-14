<template>
  <v-layout>
    <div class="zg__error">
      <v-row>
        <v-col cols="12" class="text-center">
          <div class="text-left">
            <Logo />
          </div>
          <h1 class="zg__error-heading secondary--text">{{ $tc('errors.header', error.statusCode) }}</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="text-center">
          <h4
            class="zg__error-subheading mb-12"
            v-if="error.statusCode === '404' || '500' || '503'"
          >{{ $t('errors.' + error.statusCode + '.text') }}</h4>
          <v-btn
            @click="$router.go(-1)"
            default
            class="primary font-weight-bold px-10 mx-auto"
          >{{ $t('buttons.back') }}</v-btn>
        </v-col>
      </v-row>
    </div>
  </v-layout>
</template>

<script>
import Logo from '@/components/UI/Logo.vue'

export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head() {
    const title = this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  },
  components: {
    Logo
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  }
}
</script>

<style lang='scss'>
.zg {
  &__error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    &-heading {
      font-size: 12rem;
      line-height: 1.1;
      font-weight: bold;
      margin-bottom: 3rem;
    }
    &-subheading {
      font-size: 1.8rem;
      text-align: center;
    }
  }
}
</style>
