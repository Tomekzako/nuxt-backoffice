<template>
  <div class="zg_wrapper">
    
    <!-- Header -->
    <page-title-simple :title="$t('paymentMethods.editTitle')">
      <v-btn v-if="$can('paymentWay', 'delete')" @click="remove" class="red white--text px-6 ml-2 font-weight-bold body-1">{{ $t('buttons.remove') }}</v-btn>
    </page-title-simple>

    <!-- Content -->
    <payment-method-form type="edit" :paymentMethod="responses[0]" :channels="responses[1]" :groups="responses[2]" :channelDetails="responses[3]" />

    <!-- Confirm Dialog -->
    <confirm ref="confirm" />
  </div>
</template>

<script>
import PaymentMethodForm from '@/components/Pages/PaymentMethodForm'
import PageTitleSimple from '@/components/UI/PageTitleSimple'
import Confirm from '@/components/UI/Confirm'

export default {
  components: {
    PaymentMethodForm,
    PageTitleSimple,
    Confirm
  },
  async asyncData (context) {

    let responses = []

    await Promise.all([
      context.store.dispatch('paymentMethod/getDetails', context.route.params.id),
      context.store.dispatch('paymentChannel/getResults', ''),
      context.store.dispatch('paymentGroups/getResults', '')
    ]).then((res) => {
      return context.store
        .dispatch('paymentChannel/getDetails', res[0].channel.id)
        .then(channel => {
          console.log(channel);
          
          responses.push(res[0], res[1].data, res[2].data.data, channel)          
        })
    })

    return { responses : responses }

  },
  data() {
    return {
      id: this.$route.params.id
    }
  },
  methods: {
    remove() {
      /* this.$refs.confirm
        .open(this.$t('currencies.confirm.removeTitle'), this.$t('message.info.confirmDefaultText'))
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
              .dispatch('language/deleteLanguage', this.id)
              .then(res => {
                if (res.code === 200) {
                  this.$store.commit('overlay/HIDE_OVERLAY')
                  this.$router.back()
                  const successInfo = {
                    text: this.$t('languages.deleteSuccessInfo'),
                    color: 'primary'
                  }
                  this.$store.commit('snackbar/showSnackbar', successInfo)
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
                if(e.response.data.code === 400) {
                  const errorInfo = {
                    text: this.$t('languages.info.deleteError'),
                    color: 'red'
                  }
                  this.$store.commit('snackbar/showSnackbar', errorInfo)
                } else {
                  const errorInfo = {
                    text: this.$t('errors.defaultInfo'),
                    color: 'red'
                  }
                  this.$store.commit('snackbar/showSnackbar', errorInfo)
                }
              })
          }
      }) */
    }
  }
}
</script>