<template>
  <v-row>
    <v-col>
      <v-card class="pa-3">
        <v-alert
          class="zg__profile-alert mb-4"
          v-if="!$can('currency', 'update')"
          type="warning"
          :value="true"
          dismissible
        >
          {{ $t('currencies.info.permissionDenied') }}
        </v-alert>
        <v-form v-model="valid" ref="form">
          <v-row class="px-1">
            <v-col cols="12" sm="8" class="pb-0">
              <p
                class="body-1 black--text font-weight-bold mb-2"
              >{{ $t('currencies.currencyName') }}:</p>
              <v-text-field
                v-model="currency.name"
                :label="$t('currencies.currencyName')"
                single-line
                outlined
                flat
                :rules="nameRules"
                :disabled="!$can('currency', 'update')"
              />
            </v-col>
            <v-col cols="12" sm="4" class="pb-0">
              <p
                class="body-1 black--text font-weight-bold mb-2"
              >{{ $t('currencies.currencyShortName') }}:</p>
              <v-text-field
                v-model="currency.code"
                :label="$t('currencies.currencyShortName')"
                single-line
                outlined
                flat
                :rules="shortNameRules"
                :value="forceUppercase(currency.code)"
                :disabled="!$can('currency', 'update')"
                maxlength="3"
                v-mask="shortNameMask"
              />
            </v-col>
          </v-row>
        </v-form>
        <v-row>
          <v-col>
            <v-btn
              class="primary px-6 ml-2 font-weight-bold body-1"
              :loading="loadingBtn"
              :disabled="!valid || !$can('currency', 'update')"
              @click="save"
            >
              {{
              $t('buttons.save')
              }}
            </v-btn>
            <v-btn class="secondary px-6 ml-2 font-weight-bold body-1" @click="$router.back()">
              {{
              $t('buttons.back')
              }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      id: this.$route.params.id,
      loadingBtn: false,
      valid: true,
      nameRules: [v => !!v || this.$t('validation.default.required')],
      shortNameRules: [v => v.length === 3 || this.$tc('validation.default.numberOfCharacters', 3)],
      shortNameMask: 'AAA'
    }
  },
  props: {
    type: {
      type: String,
      required: true
    },
    currency: {
      type: Object,
      required: false,
      default: () => ({
        name: '',
        code: ''
      })
    }
  },
  methods: {
    save() {
      this.loadingBtn = true

      switch (this.type) {

        case 'edit':
          let update = {
            id: this.id,
            data: {
              name: this.currency.name,
              code: this.currency.code
            }
          }
          this.$store
            .dispatch('currency/updateCurrency', update)
            .then(res => {
              this.successInfo()   
            })
            .catch((e) => {

              if(e.response.status === 409) {
                this.errorsInfo(e.response.data.error)
              }

              this.loadingBtn = false
            })
          break

        case 'add':
          let add = {
            name: this.currency.name,
            code: this.currency.code
          }

          this.$store
            .dispatch('currency/addCurrency', add)
            .then(() => {
              this.successInfo()
              this.$router.back()      
            })
            .catch((e) => {
              
              if(e.response.status === 409) {
                this.errorsInfo(e.response.data.error)
              }
                            
              this.loadingBtn = false
            }) 
          break

        default:
          break
      }
    },
    successInfo() {
      this.loadingBtn = false

      const snackbar = {
        text: this.$t('currencies.info.saveSuccess'),
        color: 'primary'
      }
      this.$store.commit('snackbar/showSnackbar', snackbar)
    },
    errorsInfo(errors) {
      for(let i in errors) {
        switch (i) {
          case 'name':
            const name = this.currency.name
            this.nameRules.push(v => v !== name || this.$t('currencies.currencyNameConflict'))
            break;

          case 'code':
            const code = this.currency.code
            this.shortNameRules.push(v => v !== code || this.$t('currencies.currencyShortNameConflict'))
            break;
        
          default:
            break;
        }
      }
      this.$refs.form.validate();
    },
    forceUppercase(el) {
      this.currency.code = el.toUpperCase()
    }
  }
}
</script>
