<template>
  <div class="zg_wrapper">
    
    <!-- Header -->
    <page-title-simple 
      :title="$t('currencies.addTitle')"
    />

    <!-- Content -->
    <currency-form type="add" />
  </div>
</template>

<script>
import CurrencyForm from '@/components/Pages/CurrencyForm'
import PageTitleSimple from '@/components/UI/PageTitleSimple'

export default {
  components: {
    CurrencyForm,
    PageTitleSimple
  }
}
</script>