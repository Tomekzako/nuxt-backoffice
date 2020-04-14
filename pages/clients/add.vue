<template>
  <div class="zg__clientForm">
    <v-container>
      <page-title-simple :title="$t('clients.addUser')" />
      <ClientForm />
    </v-container>
  </div>
</template>

<script>
import PageTitleSimple from '@/components/UI/PageTitleSimple'
import ClientForm from '@/components/Pages/ClientForm'

export default {
  components: {
    PageTitleSimple,
    ClientForm
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_mixins';
.zg {
  .zg__clientForm {
    position: relative;
    width: 70rem;
    margin: 0 auto;
    @include mQuery(md) {
      width: 100%;
    }
  }
}
</style>
