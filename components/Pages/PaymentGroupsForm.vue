<template>
  <v-row>
    <v-col>
      <v-card class="pa-3">
        <!-- <v-alert class="zg__profile-alert mb-4" v-if="!$can('paymentGroups', 'update')" type="warning" :value="true" dismissible>
            {{ $t('paymentGroups.info.permissionDenied') }}
        </v-alert>-->
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-row>
            <v-col v-if="getGroup" cols="12" sm="6" class="py-1">
              <p class="body-1 black--text font-weight-bold mb-2">{{ $t('paymentGroups.id') }}:</p>
              <v-text-field
                :label="$t('paymentGroups.id')"
                v-model="group.id"
                single-line
                outlined
                flat
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" :sm="getGroup ? 6 : 12" class="py-1">
              <p class="body-1 black--text font-weight-bold mb-2">{{ $t('paymentGroups.name') }}:</p>
              <v-text-field
                :disabled="!$can('paymentGroups', 'update')"
                :label="$t('paymentGroups.name')"
                :rules="form.name.rules"
                v-model="group.name"
                single-line
                outlined
                flat
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <div>
                <v-btn
                  default
                  :loading="loading"
                  class="primary px-10 font-weight-bold"
                  type="submit"
                  :disabled="!$can('paymentGroups', 'update')"
                >
                  {{
                  getGroup ? $t('buttons.save') : $t('buttons.create')
                  }}
                </v-btn>
                <v-btn
                  :loading="loadingBack"
                  default
                  class="secondary px-10 font-weight-bold ml-sm-2"
                  @click="back"
                >{{ $t('buttons.back') }}</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    getGroup: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      group: this.getGroup
        ? { ...this.getGroup }
        : {
            name: ''
          },
      valid: true,
      loading: false,
      loadingBack: false,
      form: {
        name: {
          rules: [v => !!v || this.$t('validation.default.required'), v => v.length >= 3 || this.$tc('validation.default.minCharacters', 3)]
        }
      }
    }
  },

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        if (this.getGroup) {
          this.$store
            .dispatch('paymentGroups/updateGroup', this.group)
            .then(res => {
              this.loading = false
              const snackbar = {
                text: this.$t('paymentGroups.updateNote'),
                color: 'primary'
              }
              this.$store.commit('snackbar/showSnackbar', snackbar)
            })
            .catch(e => {
              this.loading = false
            })
        } else {
          this.$store
            .dispatch('paymentGroups/createGroup', this.group)
            .then(res => {
              this.loading = false
              const snackbar = {
                text: this.$t('paymentGroups.createNote'),
                color: 'primary'
              }
              this.$store.commit('snackbar/showSnackbar', snackbar)
            })
            .catch(e => {
              this.loading = false
            })
        }
      }
    },
    back() {
      this.loadingBack = true
      this.$router.back()
    }
  }
}
</script>
