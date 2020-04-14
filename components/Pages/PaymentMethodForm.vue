<template>
  <v-row>
    <v-col>
      <v-card class="pa-3">
        <v-alert
          class="zg__profile-alert mb-4"
          v-if="!$can('paymentWay', 'update')"
          type="warning"
          :value="true"
          dismissible
        >
          {{ $t('paymentMethods.info.permissionDenied') }}
        </v-alert>
        <v-form v-model="valid" ref="form">
          <v-row class="px-1">
            <v-col cols="12" class="pb-0">
              <!-- Name -->
              <p
                class="body-1 black--text font-weight-bold mb-2"
              >{{ $t('paymentMethods.form.name') }}:</p>
              <v-text-field
                v-model="form.name.value"
                :label="$t('paymentMethods.form.name')"
                single-line
                outlined
                :rules="form.name.rules"
                :disabled="!$can('paymentWay', 'update')"
                flat
              />
            </v-col>
          </v-row>
          <v-row class="px-1">
            <v-col cols="12" class="pb-0">
              <!-- Status -->
              <p
                class="body-1 black--text font-weight-bold mb-2"
              >{{ $t('paymentMethods.form.status') }}:</p>
              <v-switch
                v-model="form.is_active.value"
                :label="$t('paymentMethods.form.isActive')"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row class="px-1">
            <v-col cols="12" class="pb-0">
              <!-- Channel -->
              <p
                class="body-1 black--text font-weight-bold mb-2"
              >{{ $t('paymentMethods.form.channel') }}:</p>
              <v-autocomplete
                v-model="form.channel.value"
                :search-input.sync="searchChannel"
                :items="form.channel.items"
                :rules="form.channel.rules"
                :loading="form.channel.loading"
                :label="$t('paymentMethods.form.typeToSearch')"
                @change="disabled = false"
                item-text="name"
                item-value="id"
                single-line
                outlined
                flat
                cache-items
                hide-no-data
                return-object
                clearable
              />
            </v-col>
          </v-row>
          <v-row class="px-1">
            <v-col cols="12" class="pb-0">
              <!-- Group -->
              <p
                class="body-1 black--text font-weight-bold mb-2"
              >{{ $t('paymentMethods.form.group') }}:</p>
              <v-autocomplete
                v-model="form.group.value"
                :search-input.sync="searchGroup"
                :items="form.group.items"
                :rules="form.group.rules"
                :loading="form.group.loading"
                :label="$t('paymentMethods.form.typeToSearch')"
                @change="disabled = false"
                item-text="name"
                item-value="id"
                single-line
                outlined
                flat
                cache-items
                hide-no-data
                return-object
                clearable
                multiple
              />
            </v-col>
          </v-row>
          {{ paymentMethod }}
          {{ channelDetails }}
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
      form: {
        name: {
          value: typeof this.paymentMethod.name !== 'undefined' ? this.paymentMethod.name : '',
          rules: [v => !!v || this.$t('validation.default.required'), v => v.length >= 3 || this.$tc('validation.default.minCharacters', 3)]
        },
        is_active: {
          value: typeof this.paymentMethod.is_active !== 'undefined' ? this.paymentMethod.is_active : false
        },
        channel: {
          value: typeof this.paymentMethod.channel !== 'undefined' ? this.paymentMethod.channel : {},
          rules: [v => !!v || this.$t('validation.default.required')],
          items: this.channels,
          loading: false
        },
        group: {
          value: typeof this.paymentMethod.group !== 'undefined' ? this.paymentMethod.group : [],
          rules: [v => !!v.length || this.$t('validation.default.required')],
          items: this.groups,
          loading: false
        },
      },
      searchChannel: '',
      searchGroup: ''
    }
  },
  props: {
    type: {
      type: String,
      required: true
    },
    paymentMethod: {
      type: Object,
      required: false,
      default: () => ({
        name: '',
        is_active: 0,
        channel: {},
        group: []
      })
    },
    channels: {
      type: Array,
      required: true
    },
    groups: {
      type: Array,
      required: true
    },
    channelDetails: {
      type: Object,
      required: false,
      default: {}
    }
  },
  watch: {
    searchChannel(value) {
      this.sendQuery(value, 'channel')
    },
    searchGroup(value) {
      this.sendQuery(value, 'group')
    }
  },
  methods: {
    async sendQuery(value, type) {
      const query = '?search=name=' + value
      switch (type) {
        case 'channel':
          this.form.channel.loading = true
          this.$store.dispatch('paymentChannel/getResults', query).then(res => {
            this.form.channel.items = res.data.data
            this.form.channel.loading = false
          })
          break
        case 'group':
          this.form.group.loading = true
          this.$store.dispatch('paymentGroups/getResults', query).then(res => {
            this.form.group.items = res.data.data
            this.form.group.loading = false
          })
          break

        default:
          break
      }
    },
    save() {
      this.loadingBtn = true

      /* switch (this.type) {

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
      } */
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
