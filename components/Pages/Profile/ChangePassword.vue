<template>
  <v-dialog v-model="dialog" persistent max-width="600px" class="zg_profile_dialog">
    <template v-slot:activator="{ on }">
      <v-btn default class="accent zg__profile-password font-weight-bold mx-auto mb-6" v-on.stop="on" :disabled="disableField">
        {{ $t('profile.button.passwordChange') }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <h3 class="black--text subtitle-1" style="margin: 0 auto;">{{ $t('profile.passwordUpdate') }}</h3>
      </v-card-title>
      <v-form ref="password_form" @submit.prevent="changePassword" class="pt-3">
        <v-card-text class="pb-0">
          <v-container class="pb-1">
            <v-row>
              <v-col cols="12" class="py-1">
                <p class="body-1 black--text font-weight-bold mb-2">{{ $t('profile.input.oldPassword2') }}:</p>
                <v-text-field
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="show = !show"
                  :label="$t('profile.input.oldPassword')"
                  single-line
                  outlined
                  flat
                  v-model="oldPassword"
                  :type="show ? 'text' : 'password'"
                  :rules="passwordRules"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-alert class="zg__profile-alert mb-5" v-if="passwordAlert" :type="passwordAlert.type" :value="true" dismissible color="error">
              {{ passwordAlert.message }}
            </v-alert>
            <v-row>
              <v-col cols="12" class="py-1">
                <p class="body-1 black--text font-weight-bold mb-2">{{ $t('profile.input.newPassword2') }}:</p>
                <v-text-field
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="show2 = !show2"
                  :label="$t('profile.input.newPassword')"
                  single-line
                  outlined
                  flat
                  :type="show2 ? 'text' : 'password'"
                  v-model="password"
                  :rules="passwordRules"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="py-1">
                <p class="body-1 black--text font-weight-bold mb-2">{{ $t('profile.input.repeatPassword2') }}:</p>
                <v-text-field
                  :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="show3 = !show3"
                  :label="$t('profile.input.repeatPassword')"
                  single-line
                  outlined
                  flat
                  :type="show3 ? 'text' : 'password'"
                  v-model="passwordRepeat"
                  :rules="[...passwordRepeatRules, ...passwordRules]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-container class="pt-0">
            <v-row>
              <v-col class="pt-0 px-5">
                <v-btn default type="submit" class="primary mr-2 px-10" :loading="loadingPassword">{{ $t('profile.button.updatePassword') }}</v-btn>
                <v-btn default class="secondary px-8" @click="dialog = false">{{ $t('buttons.back') }}</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    disableField: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      loadingPassword: false,
      show: false,
      show2: false,
      show3: false,
      oldPassword: '',
      password: '',
      passwordRepeatRules: [v => this.password === v || this.$t('validation.password.match')],
      passwordRules: [
        v => !!v || this.$t('validation.password.required'),
        v => v.length >= 6 || this.$t('validation.password.min'),
        v => /(?=.*[A-Z])/.test(v) || this.$t('validation.password.bigLetter'),
        v => /(?=.*\d)/.test(v) || this.$t('validation.password.number'),
        v => /([!@$%])/.test(v) || this.$t('validation.password.character')
      ],
      passwordRepeat: '',
      passwordAlert: null
    }
  },

  methods: {
    changePassword() {
      if (this.$refs.passsword_form.validate()) {
        const passwords = {
          old_password: this.oldPassword,
          new_password: this.password
        }
        this.loadingPassword = true

        this.$store
          .dispatch('user/changePassword', passwords)
          .then(res => {
            this.$router.push('/')
            this.loadingPassword = false
            const snackbar = {
              text: this.$t('profile.info.passwordUpdateSuccess'),
              color: 'primary'
            }
            this.$store.commit('snackbar/showSnackbar', snackbar)
          })
          .catch(e => {
            this.loadingPassword = false
            if (e.response) {
              if (e.response.status === 409) {
                this.passwordAlert = {
                  type: 'warning',
                  message: this.$t('profile.info.passwordChangeInvalid')
                }
              }
              this.oldPassword = ''
            } else {
              console.log(e.response)
            }
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_mixins';
.zg__profile-password {
  display: block;
  width: 75%;
  @include mQuery(md) {
    width: 80%;
  }
  @include mQuery(xs) {
    width: 100%;
  }
}
</style>
