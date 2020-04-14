<template>
  <div class="zg__clientEdit">
    <v-container>
      <page-title-simple :title="$t('clients.editUser')">
        <v-btn
          v-if="$can('client', 'delete')"
          @click="deleteClient(user.id)"
          class="red white--text px-6 ml-2 font-weight-bold body-1"
        >{{ $t('buttons.remove') }}</v-btn>
      </page-title-simple>
      <ClientForm :getUser="user" />
    </v-container>
    <Confirm ref="confirm" />
  </div>
</template>

<script>
import PageTitleSimple from '@/components/UI/PageTitleSimple'
import Confirm from '@/components/UI/Confirm.vue'
import ClientForm from '@/components/Pages/ClientForm'

export default {
  asyncData(context) {
    return context.store.dispatch('client/getClientDetails', context.route.params.id).then(res => {
      return {
        user: res
      }
    })
  },
  components: {
    PageTitleSimple,
    Confirm,
    ClientForm
  },
  methods: {
    deleteClient(id) {
      this.$refs.confirm.open(this.$t('clients.confirm.remove'), this.$t('clients.confirm.removeClient'), { color: 'red' }).then(confirm => {
        if (confirm === false) {
          return false
        } else {
          const overlay = {
            color: 'secondary',
            type: 'circular'
          }
          this.$store.commit('overlay/SHOW_OVERLAY', overlay)
          this.$store
            .dispatch('client/deleteClient', id)
            .then(res => {
              if (res === 'Success') {
                this.$router.go(-1)
              }
            })
            .then(res => {
              this.$store.commit('overlay/HIDE_OVERLAY')
              const snackbar = {
                text: this.$t('clients.deleteNote'),
                color: 'error'
              }
              this.$store.commit('snackbar/showSnackbar', snackbar)
            })
            .catch(e => {
              this.$store.commit('overlay/HIDE_OVERLAY')
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_mixins';
.zg {
  .zg__clientEdit {
    position: relative;
    width: 70rem;
    margin: 0 auto;
    @include mQuery(md) {
      width: 100%;
    }
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
