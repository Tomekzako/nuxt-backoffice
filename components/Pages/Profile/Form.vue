<template>
  <v-form @submit.prevent="submit" ref="form" v-model="formValid" :lazy-validation="formLazy" class="zg__profile_form">
    <!-- Name -->
    <v-row>
      <v-col cols="12" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('profile.input.name') }}:</p>
        <v-text-field
          :label="$t('profile.input.name')"
          single-line
          outlined
          flat
          v-model="userData.first_name"
          :rules="nameRules"
          @input="disabled = false"
          :disabled="disableField"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Surname -->
    <v-row>
      <v-col cols="12" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('profile.input.surname') }}:</p>
        <v-text-field :label="$t('profile.input.surname')" single-line outlined flat v-model="userData.last_name" @input="disabled = false" :disabled="disableField"></v-text-field>
      </v-col>
    </v-row>

    <!-- Email -->
    <v-row>
      <v-col cols="12" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('profile.input.email') }}:</p>
        <v-text-field
          :rules="emailRules"
          :label="$t('profile.input.email')"
          single-line
          outlined
          flat
          v-model="userData.email"
          :disabled="disableField || (this.type === 'me' && this.user.group.name !== 'super admin')"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- <template v-if="type !== 'me'"> -->

    <!-- Status -->
    <v-row v-if="type !== 'add'">
      <v-col cols="12" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('profile.input.status') }}:</p>
        <v-switch
          @change="disabled = false"
          v-model="userData.is_active"
          :label="$t('profile.isActive')"
          :disabled="disableField || (this.type === 'me' && this.user.group.name !== 'super admin')"
        ></v-switch>
      </v-col>
    </v-row>

    <!-- Group -->
    <v-row>
      <v-col cols="12" class="py-1">
        <p class="body-1 black--text font-weight-bold mb-2">{{ $t('profile.input.group') }}:</p>
        <v-autocomplete
          v-model="select.group"
          :search-input.sync="search"
          :items="select.items"
          :rules="groupRules"
          :loading="select.loading"
          :label="$t('profile.input.typeToSearch')"
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
          :disabled="disableField || (this.type === 'me' && this.user.group.name !== 'super admin')"
        />
      </v-col>
    </v-row>

    <!-- </template> -->

    <!-- Buttons -->
    <v-row>
      <v-col cols="12" class="mt-5">
        <div class="zg__profile_buttons">
          <v-btn default class="primary px-10 font-weight-bold" type="submit" :loading="loading" :disabled="disabled">{{ $t('profile.button.updateProfile') }}</v-btn>
          <v-btn default class="secondary px-10 font-weight-bold" @click="$router.go(-1)">{{ $t('profile.button.back') }}</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: false,
      default: () => ({
        first_name: '',
        last_name: '',
        email: '',
        is_active: false
      })
    },
    type: {
      type: String,
      required: true
    },
    disableField: {
      type: Boolean,
      required: true
    },
    group: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  watch: {
    search(value) {
      this.sendQuery(value)
    }
  },
  data() {
    return {
      disabled: true,
      formValid: true,
      formLazy: false,
      loading: false,
      emailRules: [v => !!v || this.$t('validation.email.required'), v => /.+@.+\..+/.test(v) || this.$t('validation.email.valid')],
      nameRules: [v => v.length >= 3 || this.$t('validation.name.min'), v => !!v || this.$t('validation.name.required')],
      groupRules: [v => !!v || this.$t('validation.default.required')],
      search: null,
      select: {
        group: typeof this.user.group !== 'undefined' ? this.user.group.id : [],
        items: this.group.length ? this.group : [],
        loading: false
      },
      userData: {
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        email: this.user.email,
        is_active: this.user.is_active
      }
    }
  },

  methods: {
    async sendQuery(value) {
      this.select.loading = true

      const query = '?search=name=' + value
      this.$store.dispatch('adminGroup/getResults', query).then(res => {
        this.select.items = res.data.data
        this.select.loading = false
      })
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true

        //edycja swojego profilu
        if (this.type === 'me') {
          this.$store
            .dispatch('user/updateMe', this.userData)
            .then(() => {
              this.loading = false
              this.disabled = false

              this.$store.commit('user/SET_USER_FIRSTNAME', this.userData.first_name)
              this.$store.commit('user/SET_USER_LASTNAME', this.userData.last_name)
              this.showSnackBar('success')
            })
            .catch(e => console.log(e))
        }

        //edycja profilu przez superadmina
        if (this.type === 'edit') {
          const params = {
            id: this.user.id,
            data: {
              first_name: this.userData.first_name,
              last_name: this.userData.last_name,
              email: this.userData.email,
              is_active: this.userData.is_active,
              group_id: this.select.group
            }
          }

          this.$store
            .dispatch('user/updateUser', params)
            .then(() => {
              this.loading = false
              this.disabled = false
              this.showSnackBar('success')
            })
            .catch(e => console.log(e))
        }

        //dodanie nowego usera
        if (this.type == 'add') {
          const params = {
            id: this.select.group,
            data: {
              first_name: this.userData.first_name,
              last_name: this.userData.last_name,
              email: this.userData.email
            }
          }

          this.$store
            .dispatch('user/addUser', params)
            .then(() => {
              this.loading = false
              this.disabled = false
              this.showSnackBar('success')
            })
            .catch(e => console.log(e))
        }
      }
    },
    showSnackBar(type) {
      switch (type) {
        case 'success':
          const snackbar = {
            text: this.$t('profile.info.updateSuccess'),
            color: 'primary'
          }
          this.$store.commit('snackbar/showSnackbar', snackbar)
          break

        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_mixins';
.zg__profile_form,
.zg__profile-alert {
  margin: 0 auto;
  max-width: 75%;
  @include mQuery(md) {
    max-width: 80%;
  }
  @include mQuery(xs) {
    max-width: 100%;
  }
}
.zg__profile_buttons {
  display: flex;
  justify-content: space-between;
  @include mQuery(md) {
    flex-direction: column;
  }
}
</style>
