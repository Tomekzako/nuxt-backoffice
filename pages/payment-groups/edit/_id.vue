<template>
  <div class="zg_wrapper">
    <page-title-simple :title="$t('paymentGroups.editGroup')">
      <v-btn v-if="$can('paymentGroups', 'delete')" @click="deleteGroup(group.id)" class="red white--text px-6 ml-2 font-weight-bold body-1">
        {{ $t('buttons.remove') }}
      </v-btn>
    </page-title-simple>
    <payment-groups-form :getGroup="group" />
    <Confirm ref="confirm" />
  </div>
</template>

<script>
import PageTitleSimple from '@/components/UI/PageTitleSimple'
import Confirm from '@/components/UI/Confirm.vue'
import PaymentGroupsForm from '@/components/Pages/PaymentGroupsForm'

export default {
  components: {
    PageTitleSimple,
    PaymentGroupsForm,
    Confirm
  },
  asyncData(context) {
    return context.store.dispatch('paymentGroups/getDetails', context.route.params.id).then(res => {
      return {
        group: res
      }
    })
  },
  data() {
    return {}
  },
  methods: {
    deleteGroup(id) {
      this.$refs.confirm
        .open(this.$t('paymentGroups.confirm.remove'), this.$t('paymentGroups.confirm.removeGroup'), { color: 'red' })
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
              .dispatch('paymentGroups/deleteGroup', id)
              .then(res => (res === 'Success' ? this.$router.back() : null))
              .then(res => {
                const snackbar = {
                  text: this.$t('paymentGroups.deleteNote'),
                  color: 'error'
                }
                this.$store.commit('snackbar/showSnackbar', snackbar)
                this.$store.commit('overlay/HIDE_OVERLAY')
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
