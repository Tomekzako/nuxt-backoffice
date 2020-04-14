<template>
  <div>
    <v-row class="px-1">
      <v-col cols="12" class="pb-0">
        <v-form v-model="valid" ref="form" @submit.prevent="submit">
          <v-row>
            <v-col cols="12" sm="6">
              <!-- Company Name -->
              <p class="body-1 black--text font-weight-bold mb-2">{{ $t('company.form.name') }}:</p>
              <v-text-field
                v-model="form.name.value"
                :rules="form.name.rules"
                :label="$t('company.form.name')"
                single-line
                outlined
                :disabled="!$can('company', 'update')"
                flat
              />
            </v-col>
            <v-col cols="12" sm="6">
              <!-- NIP -->
              <p class="body-1 black--text font-weight-bold mb-2">{{ $t('company.form.nip') }}:</p>
              <v-text-field
                v-model="form.nip.value"
                :rules="form.nip.rules"
                v-mask="form.nip.mask"
                :label="$t('company.form.nipFormat')"
                single-line
                outlined
                :disabled="!$can('company', 'update')"
                flat
                maxlength="10"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="6">
              <!-- Address -->
              <p class="body-1 black--text font-weight-bold mb-2">{{ $t('company.form.address') }}:</p>
              <v-text-field
                v-model="form.address.value"
                :rules="form.address.rules"
                :label="$t('company.form.address')"
                single-line
                outlined
                :disabled="!$can('company', 'update')"
                flat
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-row>
                <v-col class="py-0" cols="12" md="6">
                  <!-- City -->
                  <p class="body-1 black--text font-weight-bold mb-2">{{ $t('company.form.city') }}:</p>
                  <v-text-field
                    v-model="form.city.value"
                    :rules="form.city.rules"
                    :label="$t('company.form.city')"
                    single-line
                    outlined
                    :disabled="!$can('company', 'update')"
                    flat
                  />
                </v-col>
                <v-col class="py-0" cols="12" md="6">
                  <!-- Postal code -->
                  <p
                    class="body-1 black--text font-weight-bold mb-2"
                  >{{ $t('company.form.postalCode') }}:</p>
                  <v-text-field
                    v-model="form.postal.value"
                    :rules="form.postal.rules"
                    v-mask="form.postal.mask"
                    :label="$t('company.form.postalCodeFormat')"
                    single-line
                    outlined
                    :disabled="!$can('company', 'update')"
                    flat
                    maxlength="6"
                    style="max-width: 150px"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="6">
              <!-- Language -->
              <p class="body-1 black--text font-weight-bold mb-2">{{ $t('company.form.language') }}:</p>
              <v-autocomplete
                v-model="form.language.value"
                :search-input.sync="searchLanguage"
                :items="form.language.items"
                :rules="form.language.rules"
                :loading="form.language.loading"
                :label="$t('company.form.typeToSearch')"
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
            <v-col cols="12" sm="6">
              <!-- Currency -->
              <p class="body-1 black--text font-weight-bold mb-2">{{ $t('company.form.currency') }}:</p>
              <v-autocomplete
                v-model="form.currency.value"
                :search-input.sync="searchCurrency"
                :items="form.currency.items"
                :rules="form.currency.rules"
                :loading="form.currency.loading"
                :label="$t('company.form.typeToSearch')"
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

          <v-row>
            <v-col cols="12">
              <!-- Policy -->
              <p class="body-1 black--text font-weight-bold mb-2">{{ $t('company.form.policy') }}:</p>
              <WYSIWYG />
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
import WYSIWYG from '@/components/UI/WYSIWYG'

export default {
  components: {
    WYSIWYG
  },
  props: {
    company: {
      type: Object,
      required: true
    },
    languages: {
      type: Array,
      required: true
    },
    currencies: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      valid: true,
      loadingBtn: false,
      disabled: true,
      form: {
        name: {
          value: typeof this.company.name !== 'undefined' ? this.company.name : '',
          rules: [v => !!v || this.$t('validation.default.required'), v => v.length >= 3 || this.$tc('validation.default.minCharacters', 3)]
        },
        address: {
          value: typeof this.company.address !== 'undefined' ? this.company.address : '',
          rules: [v => !!v || this.$t('validation.default.required'), v => (!!v && v.length >= 3) || this.$tc('validation.default.minCharacters', 3)]
        },
        postal: {
          value: typeof this.company.zipcode !== 'undefined' ? this.company.zipcode : '',
          mask: '##-###',
          rules: [v => /[0-9]{2}-[0-9]{3}/g.test(v) || this.$t('validation.default.required')]
        },
        city: {
          value: typeof this.company.city !== 'undefined' ? this.company.city : '',
          rules: [v => !!v || this.$t('validation.default.required'), v => (!!v && v.length >= 3) || this.$tc('validation.default.minCharacters', 3)]
        },
        nip: {
          value: typeof this.company.nip !== 'undefined' ? this.company.nip : '',
          mask: '##########',
          rules: [v => !!v || this.$t('validation.default.required'), v => (!!v && v.length === 10) || this.$tc('validation.default.minCharacters', 10)]
        },
        language: {
          value: typeof this.company.lang !== 'undefined' ? this.company.lang : {},
          items: this.languages,
          rules: [true],
          loading: false
        },
        currency: {
          value: typeof this.company.currency !== 'undefined' ? this.company.currency : {},
          items: this.currencies,
          rules: [true],
          loading: false
        }
      },
      searchLanguage: '',
      searchCurrency: ''
    }
  },
  watch: {
    searchLanguage(value) {
      this.sendQuery(value, 'lang')
    },
    searchCurrency(value) {
      this.sendQuery(value, 'currency')
    }
  },
  methods: {
    async sendQuery(value, type) {
      const query = '?search=name=' + value
      switch (type) {
        case 'lang':
          this.form.language.loading = true
          this.$store.dispatch('language/getResults', query).then(res => {
            this.form.language.items = res.data.data
            this.form.language.loading = false
          })
          break
        case 'currency':
          this.form.currency.loading = true
          this.$store.dispatch('currency/getResults', query).then(res => {
            this.form.currency.items = res.data.data
            this.form.currency.loading = false
          })
          break

        default:
          break
      }
    },
    submit() {
      const obj = {
        id: 1, // default
        data: {
          name: this.form.name.value,
          address: this.form.address.value,
          zipcode: this.form.postal.value,
          city: this.form.city.value,
          nip: this.form.nip.value,
          currency: this.form.currency.value.id,
          lang: this.form.language.value.id,
          policy: this.$store.state.wysiwyg.value
        }
      }

      this.loadingBtn = true

      this.$store
        .dispatch('company/updateBaseInfo', obj)
        .then(res => {
          if (res.code === 200) {
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