<template>
  <v-layout justify-center align-center>
    <v-card class="elevation-10" :loading="loading" :disabled="loading" style="flex: 0 1 400px">
      <v-card-title class="headline">
        {{ $t('login.passwordResetRequest') }}
      </v-card-title>
      <v-card-text>
        <v-form
          @submit.prevent="submit"
          ref="form"
          v-model="formValid"
          :lazy-validation="formLazy"
        >
          <v-alert v-if="alert" :type="alert.type" :value="true">
            {{ alert.message }}
          </v-alert>
          <v-text-field :label="$t('passwordReset.input.email')" v-model="email" :rules="emailRules" />
          <v-btn type="submit" :loading="loading">{{ $t('passwordReset.button.passwordReset') }}</v-btn>
          <v-btn text to="/login" nuxt>{{ $t('buttons.back') }}</v-btn>
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

  created () {
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
      emailRules: [
        v => !!v || this.$t('validation.email.required'),
        v => /.+@.+\..+/.test(v) || this.$t('validation.email.valid'),
      ],
      alert: null
    }
  },

  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const response = await this.$store.dispatch('auth/resetRequest', {
            email: this.email
          })
          this.loading = false
          this.alert = {
            type: 'success',
            message: this.$t('passwordReset.info.passwordResetRequestSuccess')
          }
          this.email = ''
          this.$refs.form.reset()
        } catch (e) {
          this.alert = {
            type: 'error',
            message: this.$t('message.info.generalError')
          }
          this.loading = false
        }
      }
    }
  }

}
</script>
