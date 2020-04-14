<template>
  <v-row>
    <v-col>
      <v-card class="pa-3">
        <v-alert
          class="zg__profile-alert mb-4"
          v-if="!$can('language', 'update')"
          type="warning"
          :value="true"
          dismissible
        >
          {{ $t('languages.info.permissionDenied') }}
        </v-alert>
        <v-form v-model="valid" ref="form">
          <v-row class="px-1">
              <v-col cols="12" sm="8" class="pb-0">
                <p
                  class="body-1 black--text font-weight-bold mb-2"
                >{{ $t('languages.languageName') }}:</p>
                <v-text-field
                  v-model="language.name"
                  :label="$t('languages.languageName')"
                  single-line
                  outlined
                  :rules="nameRules"
                  :disabled="!$can('language', 'update')"
                  flat
                />
              </v-col>
              <v-col cols="12" sm="4" class="pb-0">
                <p
                  class="body-1 black--text font-weight-bold mb-2"
                >{{ $t('languages.languageShortName') }}:</p>
                <v-text-field
                  v-model="language.code"
                  :label="$t('languages.languageShortName')"
                  single-line
                  outlined
                  flat
                  :rules="shortNameRules"
                  :disabled="!$can('language', 'update')"
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
              :disabled="!valid || !$can('language', 'update')"
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
    language: {
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
              name: this.language.name,
              code: this.language.code
            }
          }
          this.$store
            .dispatch('language/updateLanguage', update)
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
            name: this.language.name,
            code: this.language.code
          }

          this.$store
            .dispatch('language/addLanguage', add)
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
        text: this.$t('languages.info.saveSuccess'),
        color: 'primary'
      }
      this.$store.commit('snackbar/showSnackbar', snackbar)
    },
    errorsInfo(errors) {
      for(let i in errors) {
        switch (i) {
          case 'name':
            const name = this.language.name
            this.nameRules.push(v => v !== name || this.$t('languages.languageNameConflict'))
            break;

          case 'code':
            const code = this.language.code
            this.shortNameRules.push(v => v !== code || this.$t('languages.languageShortNameConflict'))
            break;
        
          default:
            break;
        }
      }
      this.$refs.form.validate();
    }
  }
}
</script>
