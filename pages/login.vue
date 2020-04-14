<template>
  <div class="zg__login">
    <v-row>
      <v-col cols="12" class="text-center my-12">
        <h3 class="black--text subtitle-1">{{ $t('login.title') }}</h3>
      </v-col>
    </v-row>
    <v-card class="zg__login--card" flat :loading="loading" :disabled="loading">
      <v-card-text class="px-6 py-5">
        <v-form @submit.prevent="submit" ref="form" v-model="formValid" :lazy-validation="formLazy">
          <v-alert v-if="alert" :type="alert.type" :value="true">{{ alert.message }}</v-alert>
          <v-row>
            <v-col class="py-1" cols="12">
              <p class="body-1 black--text font-weight-bold">{{ $t('login.input.email') }}:</p>
              <v-text-field single-line outlined flat v-model="email" :rules="emailRules" />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-1" cols="12">
              <p class="body-1 black--text font-weight-bold">{{ $t('login.password') }}:</p>
              <v-text-field single-line outlined flat v-model="password" type="password" :rules="passwordRules" />
            </v-col>
          </v-row>
          <template v-if="captchaImage">
            <img :src="captchaImage" alt />
            <v-text-field label="Captcha" v-model="captcha" />
          </template>
          <v-btn type="submit" default class="primary px-10 font-weight-bold" :loading="loading">{{ $t('login.button.logIn') }}</v-btn>
          <v-btn text to="/password-reset-request" nuxt>{{ $t('login.button.forgotPassword') }}</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <p class="zg_app-version">version: {{ appVersion }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  layout: 'no-admin',
  computed: {
    ...mapGetters({
      localTokenData: 'auth/getTokenData'
    })
  },
  created() {
    if (this.localTokenData !== null) {
      this.$router.push('/')
    }
  },

  data() {
    return {
      formValid: true,
      formLazy: false,
      loading: false,
      email: '',
      emailRules: [v => !!v || this.$t('validation.email.required'), v => /.+@.+\..+/.test(v) || this.$t('validation.email.valid')],
      password: '',
      passwordRules: [v => v.length >= 2 || 'Min 2 znaków', v => !!v || this.$t('validation.password.required')],
      alert: null,
      captcha: '',
      captchaToken: '',
      captchaImage: null,
      appVersion: process.env.appVersion
    }
  },

  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          // logujemy usera
          const response = await this.$store.dispatch('auth/login', {
            email: this.email,
            password: this.password,
            captcha: {
              token: this.captchaToken,
              result: this.captcha
            }
          })
          this.$router.push('/')
        } catch (e) {
          this.loading = false

          if (e.response && e.response.data) {
            if (e.response.data.captcha) {
              this.captchaImage = 'data:image/png;base64,' + e.response.data.captcha.img
              this.captchaToken = e.response.data.captcha.token
            } else {
              this.captchaImage = null
            }
          }
          if (e.response) {
            if (e.response.status === 403) {
              this.alert = {
                type: 'warning',
                message: this.$t('login.info.authAccountInactive')
              }
            }
          } else {
            this.alert = {
              type: 'warning',
              message: this.$t('login.info.authError')
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.zg {
  .zg__login {
    background: #f3f3f3;
    max-width: 67rem;
    margin: 0 auto;
    display: block;
    &--card {
      box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.15);
    }
  }
}

.zg_app-version {
  text-align: right;
  font-size: 0.9rem;
  padding: 5px 0;
}
</style>
