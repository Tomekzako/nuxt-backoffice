<template>
  <v-layout justify-center align-center>
    <v-card class="elevation-10" :loading="loading" :disabled="loading" style="flex: 0 1 400px">
      <v-card-title class="headline">
        {{ $t('login.passwordReset') }}
      </v-card-title>
      <v-card-text>
        <v-form
          @submit.prevent="submit"
          ref="form"
          v-model="formValid"
          :lazy-validation="formLazy"
        >
          <v-alert v-if="alert" :type="alert.type" :value="true">
              <template v-if="alert.type === 'success'">
                <v-row align="left">
                    <v-col class="grow">{{ alert.message }}</v-col>
                    <v-col class="shrink">
                    <v-btn to="/login" nuxt>{{$t('passwordReset.button.logIn')}}</v-btn>
                    </v-col>
                </v-row>
              </template>
              <template v-else>
                  {{ alert.message }}
              </template>
          </v-alert>
          <v-text-field :label="$t('passwordReset.input.password')" v-model="password" type="password" :rules="passwordRules" />
          <v-text-field :label="$t('passwordReset.input.passwordRepeat')" v-model="passwordRepeat" type="password" :rules="passwordRepeatRules" />
          <v-btn type="submit" :loading="loading">{{ $t('passwordReset.button.passwordChange') }}</v-btn>
          <v-btn text to="/login" nuxt>{{ $t('passwordReset.button.logIn') }}</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-layout>
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

  validate ({ params }) {
    if (!params.t || params.t === '') {
        return false
    }
    return true
  },

  created () {
    if (this.localTokenData !== null) {
      this.$router.push('/')
    }
    this.resetToken = this.$route.params.t
  },

  data() {
    return {
      formValid: true,
      formLazy: false,
      loading: false,
      password: '',
      passwordRules: [
        v => !!v || this.$t('validation.password.required')
      ],
      passwordRepeat: '',
      passwordRepeatRules: [
        v => !!v || this.$t('validation.password.required'),
        v => this.password === v || 'Hasła nie pasują' 
      ],
      alert: null,
      resetToken: null
    }
  },

  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const response = await this.$store.dispatch('auth/reset', {
            password: this.password,
            t: this.resetToken
          })
          this.loading = false
          this.alert = {
            type: 'success',
            message: this.$t('passwordReset.info.passwordResetSuccess')
          }
          this.password = ''
          this.passwordRepeat = ''
          this.$refs.form.reset()
        } catch (e) {
            if (e.response) {
                switch (e.response.status) {
                    case 400:
                        this.alert = {
                            type: 'error',
                            message: this.$t('passwordReset.info.resetTokenInvalid')
                        }
                        break;
                    case 409:
                        this.alert = {
                            type: 'error',
                            message: this.$t('passwordReset.info.resetPasswordTooWeak')
                        }
                        break;
                    default:
                        this.alert = {
                            type: 'error',
                            message: this.$t('message.info.generalError')
                        }
                }
            } else {
                this.alert = {
                    type: 'error',
                    message: this.$t('message.info.generalError')
                }
            }
          this.loading = false
        }
      }
    }
  }

}
</script>
