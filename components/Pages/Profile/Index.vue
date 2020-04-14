<template>
  <div class="zg__profile">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h3 v-if="type === 'me'" class="black--text subtitle-1 text-center mb-2">{{ $t('profile.editTitle') }}</h3>
          <h3 v-if="type === 'add'" class="black--text subtitle-1 text-center mb-2">{{ $t('profile.addTitle') }}</h3>
        </v-col>
      </v-row>
      <v-alert class="zg__profile-alert mb-4" v-if="disableField()" type="warning" :value="true" dismissible>
        {{ $t('profile.info.permissionDenied') }}
      </v-alert>

      <avatar :disableField="disableField()" :type="type" :user="user" />
      <change-password :disableField="disableField()" :type="type" :user="user" v-if="type !== 'add'" />
      <form-user :disableField="disableField()" :type="type" :user="user" :group="group" />
    </v-container>
  </div>
</template>

<script>
import Avatar from '@/components/Pages/Profile/Avatar'
import ChangePassword from '@/components/Pages/Profile/ChangePassword'
import FormUser from '@/components/Pages/Profile/Form'

export default {
  components: {
    Avatar,
    ChangePassword,
    FormUser
  },
  methods: {
    disableField() {
      switch (this.type) {
        case 'edit':
          if (
            (this.user.id !== this.$store.state.user.user.id && this.user.group.name === 'super admin') || // jeżeli profil innego superadmina
            !this.$can('user', 'update') // jeżeli nie ma uprawnień
          ) {
            return true
          } else {
            return false
          }
          break

        case 'add':
          if (
            !this.$can('user', 'create') // jeżeli nie ma uprawnień
          ) {
            return true
          } else {
            return false
          }
          break

        case 'me':
          return false

        default:
          break
      }
    }
  },
  props: {
    user: {
      type: Object,
      required: false,
      default: () => ({
        first_name: '',
        last_name: '',
        email: ''
      })
    },
    group: {
      type: Array,
      required: false,
      default: () => []
    },
    type: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_mixins';
.zg {
  .zg__profile {
    position: relative;
    width: 70rem;
    margin: 0 auto;
    background: #fff;
    border-radius: 0.5rem;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.15);
    @include mQuery(md) {
      width: 100%;
    }
  }
}
</style>
