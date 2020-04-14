<template>
  <v-form ref="form" v-model="formValid" class="zg__clientForm_form" @submit.prevent="submit">
    <v-row>
      <v-col cols="12" sm="6" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('clients.first_name') }}:</p>
        <v-text-field
          :disabled="!$can('client', getUser ? 'update' : 'create')"
          :label="$t('clients.first_name')"
          :rules="form.first_name.rules"
          v-model="user.first_name"
          single-line
          outlined
          flat
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('clients.last_name') }}:</p>
        <v-text-field
          :disabled="!$can('client', getUser ? 'update' : 'create')"
          :label="$t('clients.last_name')"
          v-model="user.last_name"
          :rules="form.last_name.rules"
          single-line
          outlined
          flat
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row v-if="!getUser">
      <v-col cols="12" sm="6" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('clients.password') }}:</p>
        <v-text-field
          :disabled="!$can('client', getUser ? 'update' : 'create')"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="show = !show"
          :label="$t('clients.password')"
          single-line
          outlined
          flat
          v-model="user.password"
          :type="show ? 'text' : 'password'"
          :rules="form.password.rules"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('clients.passwordRepeat') }}:</p>
        <v-text-field
          :disabled="!$can('client', getUser ? 'update' : 'create')"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="show = !show"
          :label="$t('clients.passwordRepeat')"
          single-line
          outlined
          flat
          v-model="user.passwordRepeat"
          :type="show ? 'text' : 'password'"
          :rules="form.passwordRepeat.rules"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('clients.pesel') }}:</p>
        <v-text-field
          v-mask="form.pesel.mask"
          :disabled="!$can('client', getUser ? 'update' : 'create')"
          :label="$t('clients.pesel')"
          v-model="user.pesel"
          :rules="form.pesel.rules"
          single-line
          outlined
          flat
          maxlength="11"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('clients.email') }}:</p>
        <v-text-field
          :disabled="!$can('client', getUser ? 'update' : 'create')"
          :label="$t('clients.email')"
          :rules="form.email.rules"
          v-model="user.email"
          single-line
          outlined
          flat
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('clients.city') }}:</p>
        <v-text-field
          :disabled="!$can('client', getUser ? 'update' : 'create')"
          :label="$t('clients.city')"
          :rules="form.city.rules"
          v-model="user.city"
          single-line
          outlined
          flat
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('clients.zipcode') }}:</p>
        <v-text-field
          v-mask="form.zipcode.mask"
          :disabled="!$can('client', getUser ? 'update' : 'create')"
          :label="$t('clients.zipcode')"
          :rules="form.zipcode.rules"
          @input="zipcodeRules"
          v-model="user.zipcode"
          single-line
          outlined
          flat
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('clients.street') }}:</p>
        <v-text-field
          :disabled="!$can('client', getUser ? 'update' : 'create')"
          :label="$t('clients.street')"
          :rules="form.street.rules"
          v-model="user.street"
          single-line
          outlined
          flat
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('clients.house') }}:</p>
        <v-text-field
          :disabled="!$can('client', getUser ? 'update' : 'create')"
          :label="$t('clients.house')"
          v-model="user.house"
          :rules="form.house.rules"
          single-line
          outlined
          flat
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('clients.date_of_birth') }}:</p>
        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="user.date_of_birth"
              :label="$t('clients.date_of_birth')"
              append-icon="mdi-calendar-month-outline"
              readonly
              hide-details
              single-line
              outlined
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker ref="picker" v-model="user.date_of_birth" :max="date" min="1950-01-01" @change="saveBirthday"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="6" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('clients.doc_id') }}:</p>
        <v-text-field
          v-mask="form.doc_id.mask"
          :disabled="getUser ? true : !$can('client', 'create')"
          :rules="form.doc_id.rules"
          :label="$t('clients.doc_id')"
          v-model="user.doc_id"
          single-line
          outlined
          flat
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-if="this.getUser" cols="12" sm="6" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('clients.id') }}:</p>
        <v-text-field disabled :label="$t('clients.id')" v-model="user.id" single-line outlined flat @input="disabled = false"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('clients.status') }}:</p>
        <v-switch
          :disabled="!$can('client', getUser ? 'update' : 'create')"
          hide-details
          v-model="user.is_active"
          :label="$t('clients.status')"
        ></v-switch>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="mt-5">
        <div class="zg__clientForm_buttons">
          <v-btn
            default
            :loading="loading"
            class="primary px-10 font-weight-bold"
            type="submit"
            :disabled="!$can('client', getUser ? 'update' : 'create')"
            >{{ getUser ? $t('buttons.save') : $t('buttons.create') }}</v-btn
          >
          <v-btn :loading="loadingBack" default class="secondary px-10 font-weight-bold" @click="back">{{ $t('buttons.back') }}</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  props: {
    getUser: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      user: this.getUser
        ? { ...this.getUser }
        : {
            first_name: '',
            last_name: '',
            pesel: null,
            email: '',
            password: '',
            passwordRepeat: '',
            city: '',
            zipcode: '',
            street: '',
            house: '',
            date_of_birth: '',
            created_at: '',
            id: '',
            doc_id: '',
            active: false
          },
      menu: false,
      date: new Date().toISOString().substr(0, 10),
      form: {
        first_name: {
          rules: [v => !!v || this.$t('validation.default.required'), v => v.length >= 3 || this.$tc('validation.default.minCharacters', 3)]
        },
        last_name: {
          rules: [v => !!v || this.$t('validation.default.required'), v => v.length >= 3 || this.$tc('validation.default.minCharacters', 3)]
        },
        password: {
          rules: [
            v => !!v || this.$t('validation.password.required'),
            v => v.length >= 6 || this.$t('validation.password.min'),
            v => /(?=.*[A-Z])/.test(v) || this.$t('validation.password.bigLetter'),
            v => /(?=.*\d)/.test(v) || this.$t('validation.password.number'),
            v => /([!@$%])/.test(v) || this.$t('validation.password.character')
          ]
        },
        passwordRepeat: {
          rules: [v => this.user.password === v || this.$t('validation.password.match')]
        },
        email: {
          rules: [v => !!v || this.$t('validation.email.required'), v => /.+@.+\..+/.test(v) || this.$t('validation.email.valid')]
        },
        zipcode: {
          mask: '##-###',
          rules: []
        },
        city: {
          // rules: [v => !!v || this.$t('validation.default.required'), v => (!!v && v.length >= 3) || this.$tc('validation.default.minCharacters', 3)]
        },
        pesel: {
          mask: '###########',
          rules: [
            v => !!v || this.$t('validation.default.required'),
            v => (!!v && v.length === 11) || this.$tc('validation.default.numberOfCharacters', 11)
          ]
        },
        street: {
          // rules: [v => !!v || this.$t('validation.default.required'), v => (!!v && v.length >= 3) || this.$tc('validation.default.minCharacters', 3)]
        },
        house: {
          // rules: [v => !!v || this.$t('validation.default.required')]
        },
        date_of_birth: {
          // rules: [v => !!v || this.$t('validation.default.required')]
        },
        doc_id: {
          mask: 'AAA ######',
          rules: [
            v => !!v || this.$t('validation.default.required'),
            v => (!!v && v.length === 10) || this.$tc('validation.default.minCharacters', 10)
          ]
        },
        is_active: {}
      },
      formValid: true,
      loading: false,
      loadingBack: false,
      show: false
    }
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    saveBirthday(date) {
      this.$refs.menu.save(date)
      this.user.date_of_birth = date
    },
    zipcodeRules(e) {
      const zipcode = this.user.zipcode.length
      if (zipcode > 0) {
        this.form.zipcode.rules = []
        this.form.zipcode.rules.push(v => /[0-9]{2}-[0-9]{3}/g.test(v) || this.$tc('validation.default.numberOfCharacters', 5))
      } else {
        this.form.zipcode.rules = []
      }
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true

        /* Edit Client */
        if (this.getUser) {
          this.$store
            .dispatch('client/updateClient', this.user)
            .then(res => {
              this.loading = false
              const snackbar = {
                text: this.$t('clients.updateNote'),
                color: 'primary'
              }
              this.$store.commit('snackbar/showSnackbar', snackbar)
            })
            .catch(e => {
              this.loading = false
            })
        } else {
          /* Create Client */
          this.$store
            .dispatch('client/createClient', this.user)
            .then(res => {
              this.loading = false
              const snackbar = {
                text: this.$t('clients.createNote'),
                color: 'primary'
              }
              this.$store.commit('snackbar/showSnackbar', snackbar)
            })
            .catch(e => {
              if (e.response.status === 409) {
                this.errorsInfo(e.response.data.error)
              }
              this.loading = false
            })
        }
      }
    },
    errorsInfo(errors) {
      for (let i in errors) {
        switch (i) {
          case 'email':
            const email = this.user.email
            this.form.email.rules.push(v => v !== email || this.$t('validation.email.occupied'))
            break

          case 'pesel':
            const pesel = this.user.pesel
            this.form.pesel.rules.push(v => v !== pesel || this.$t('validation.pesel.occupied'))
            break

          case 'doc_id':
            const doc_id = this.user.doc_id
            this.form.doc_id.rules.push(v => v !== doc_id || this.$t('validation.doc_id.occupied'))
            break

          default:
            break
        }
      }
      this.$refs.form.validate()
    },
    back() {
      this.loadingBack = true
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/_mixins';
.zg {
  .zg__clientForm {
    &_form {
      background: #fff;
      border-radius: 0.5rem;
      box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.15);
      padding: 2rem;
    }
    &_buttons {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
