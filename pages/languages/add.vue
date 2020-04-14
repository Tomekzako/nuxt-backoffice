<template>
  <div class="zg_wrapper">
    
    <!-- Header -->
    <page-title-simple 
      :title="$t('languages.addTitle')"
    />

    <!-- Content -->
    <language-form type="add" />
  </div>
</template>

<script>
import LanguageForm from '@/components/Pages/LanguageForm'
import PageTitleSimple from '@/components/UI/PageTitleSimple'

export default {
  components: {
    LanguageForm,
    PageTitleSimple
  }
}
</script>