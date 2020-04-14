<template>
  <div class="zg__clientForm">
    <v-container>
      <page-title-simple :title="$t('paymentGroups.addGroup')" />
      <payment-groups-form />
    </v-container>
  </div>
</template>

<script>
import PageTitleSimple from '@/components/UI/PageTitleSimple'
import PaymentGroupsForm from '@/components/Pages/PaymentGroupsForm'

export default {
  components: {
    PageTitleSimple,
    PaymentGroupsForm
  }
}
</script>
