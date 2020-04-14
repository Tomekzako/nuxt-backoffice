<template>
  <div class="zg_wrapper">
    <!-- Header -->
    <page-title-simple :title="$t('profile.detailsTitle')">
      <v-btn v-if="$can('admin', 'delete')" @click="remove" class="red white--text px-6 ml-2 font-weight-bold body-1">{{ $t('buttons.remove') }}</v-btn>
    </page-title-simple>

    <!-- Content -->
    <profile-form :user="user" :group="group" type="edit" />
    
    <!-- Confirm Dialog -->
    <confirm ref="confirm" />
  </div>
</template>

<script>
import PageTitleSimple from '@/components/UI/PageTitleSimple'
import ProfileForm from '@/components/Pages/Profile/Index'
import Confirm from '@/components/UI/Confirm'

export default {
  components: {
    ProfileForm,
    PageTitleSimple,
    Confirm
  },
  async asyncData (context) {

    return context.store
      .dispatch('user/getUserDetails', context.route.params.id)
      .then((user) => {
        return context.store
          .dispatch('adminGroup/getResults', '?search=name=' + user.group.name)
          .then(res => {
            return {
              user: user,
              group: res.data.data
            }
          })
      })
  },
  data() {
    return {
      id: this.$route.params.id
    }
  },
  methods: {
    remove() {
      this.$refs.confirm
        .open(this.$t('profile.confirm.removeTitle'), this.$t('message.info.confirmDefaultText'))
        .then(confirm => {
          if (confirm === false) {
            return false
          } else {

            const overlay = {
              color: 'secondary',
              type: 'circular'
            }

            this.$store.commit('overlay/SHOW_OVERLAY', overlay)
            this.$store
              .dispatch('admin/deleteAdmin', this.id)
              .then(res => {
                if (res.code === 200) {
                  this.$store.commit('overlay/HIDE_OVERLAY')
                  const successInfo = {
                    text: this.$t('admins.info.removeSuccess'),
                    color: 'primary'
                  }
                  this.$store.commit('snackbar/showSnackbar', successInfo)
                  this.$router.back()
                } else {
                  this.$store.commit('overlay/HIDE_OVERLAY')
                  const errorInfo = {
                    text: this.$t('errors.defaultInfo'),
                    color: 'red'
                  }
                  this.$store.commit('snackbar/showSnackbar', errorInfo)
                }
              })
              .catch(e => {
                this.$store.commit('overlay/HIDE_OVERLAY')
                  const errorInfo = {
                    text: this.$t('errors.defaultInfo'),
                    color: 'red'
                  }
                  this.$store.commit('snackbar/showSnackbar', errorInfo)
              })
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_mixins';
.zg_wrapper {
  position: relative;
  width: 70rem;
  margin: 0 auto;
  @include mQuery(md) {
    width: 100%;
  }
}
</style>