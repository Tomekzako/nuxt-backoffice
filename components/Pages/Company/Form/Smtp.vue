<template>
  <div>

    <v-row class="px-1">
      <v-col cols="12" class="pb-0">
        <v-form 
          v-model="valid"
          ref="form"
          @submit.prevent="submit"
        >

          <v-row>
            <v-col cols="12" sm="6">
              <!-- Host -->
              <p class="body-1 black--text font-weight-bold mb-2">{{ $t('company.form.host') }}:</p>
              <v-text-field
                v-model="form.host.value"
                :rules="form.host.rules"
                :label="$t('company.form.host')"
                single-line
                outlined
                :disabled="!$can('company', 'update')"
                flat
              />
            </v-col>
            <v-col cols="12" sm="6">
              <!-- Port -->
              <p class="body-1 black--text font-weight-bold mb-2">{{ $t('company.form.port') }}:</p>
              <v-text-field
                style="max-width: 100px;"
                v-mask="form.port.mask"
                v-model="form.port.value"
                :rules="form.port.rules"
                :label="$t('company.form.port')"
                single-line
                outlined
                :disabled="!$can('company', 'update')"
                flat
              />
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12" sm="6">
              <!-- Username -->
              <p class="body-1 black--text font-weight-bold mb-2">{{ $t('company.form.username') }}:</p>
              <v-text-field
                v-model="form.username.value"
                :rules="form.username.rules"
                :label="$t('company.form.username')"
                single-line
                outlined
                :disabled="!$can('company', 'update')"
                flat
              />
            </v-col>
            <v-col cols="12" sm="6">
              <!-- Password -->
              <p class="body-1 black--text font-weight-bold mb-2">{{ $t('company.form.password') }}:</p>
              <v-text-field
                v-model="form.password.value"
                type="password"
                :label="$t('company.form.password')"
                single-line
                outlined
                :disabled="!$can('company', 'update')"
                flat
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="6">
              <!-- SenderEmail -->
              <p class="body-1 black--text font-weight-bold mb-2">{{ $t('company.form.senderEmail') }}:</p>
              <v-text-field
                v-model="form.sender_email.value"
                :rules="form.sender_email.rules"
                :label="$t('company.form.senderEmail')"
                single-line
                outlined
                :disabled="!$can('company', 'update')"
                flat
              />
            </v-col>
            <v-col cols="12" sm="6">
              <!-- SenderName -->
              <p class="body-1 black--text font-weight-bold mb-2">{{ $t('company.form.senderName') }}:</p>
              <v-text-field
                v-model="form.sender_name.value"
                :rules="form.sender_name.rules"
                :label="$t('company.form.senderName')"
                single-line
                outlined
                :disabled="!$can('company', 'update')"
                flat
              />
            </v-col>
          </v-row>

          <!-- Buttons -->
          <v-row>
            <v-col cols="12" class="mt-5">
              <div>
                <v-btn
                  default
                  class="primary px-10 mr-2 my-1 font-weight-bold"
                  type="submit"
                  :loading="loadingBtn"
                  :disabled="!valid || !$can('company', 'update')"
                >{{ $t('profile.button.updateProfile') }}</v-btn>
                <v-btn
                  default
                  class="secondary px-10 my-1 font-weight-bold"
                  @click="$router.go(-1)"
                >{{ $t('profile.button.back') }}</v-btn>
              </div>
            </v-col>
          </v-row>

        </v-form>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import Confirm from '@/components/UI/Confirm'

export default {
  props: {
    smtp: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      valid: true,
      loadingBtn: false,
      form: {
        host: {
          value: this.smtp !== null && typeof this.smtp.host !== 'undefined' ? this.smtp.host : '',
          rules: [
            v => !!v || this.$t('validation.default.required')
          ]
        },
        username: {
          value: this.smtp !== null && typeof this.smtp.username !== 'undefined' ? this.smtp.username : '',
          rules: [
            v => !!v || this.$t('validation.default.required')
          ]
        },
        password: {
          value: this.smtp !== null && typeof this.smtp.password !== 'undefined' ? this.smtp.password : '',
        },
        port: {
          value: this.smtp !== null && typeof this.smtp.port !== 'undefined' ? this.smtp.port : '',
          mask: '####',
          rules: [
            v => !!v || this.$t('validation.default.required')
          ]
        },
        sender_email: {
          value: this.smtp !== null && typeof this.smtp.sender_email !== 'undefined' ? this.smtp.sender_email : '',
          rules: [
            v => !!v || this.$t('validation.default.required'),
            v => !!v || this.$t('validation.email.required'), v => /.+@.+\..+/.test(v) || this.$t('validation.email.valid')
          ]
        },
        sender_name: {
          value: this.smtp !== null && typeof this.smtp.sender_name !== 'undefined' ? this.smtp.sender_name : '',
          rules: [
            v => !!v || this.$t('validation.default.required')
          ]
        }
      }
    }
  },
  methods: {
    submit() {

      const obj = {
        id: 1, // default
        data: {
          host: this.form.host.value,
          username: this.form.username.value,
          password: this.form.password.value,
          port: this.form.port.value,
          sender_email: this.form.sender_email.value,
          sender_name: this.form.sender_name.value
        }
      }

      this.loadingBtn = true
      const action = this.smtp === null ? 'company/addSmtp' : 'company/updateSmtp'

      this.$store
        .dispatch(action, obj)
        .then(res => {
          if(res.code === 200) {
            const successInfo = {
              text: this.$t('company.info.success'),
              color: 'primary'
            }
            this.$store.commit('snackbar/showSnackbar', successInfo)
          } else {
            const errorInfo = {
              text: this.$t('errors.defaultInfo'),
              color: 'red'
            }
            this.$store.commit('snackbar/showSnackbar', errorInfo)
          }
          this.loadingBtn = false
        })
        .catch(e => {
          this.loadingBtn = false
          const errorInfo = {
            text: this.$t('errors.defaultInfo'),
            color: 'red'
          }
          this.$store.commit('snackbar/showSnackbar', errorInfo)
        })

    }
  }
}
</script>

<style lang="scss">
</style>