<template>
  <div class="zg_wrapper">
    
    <!-- Header -->
    <page-title-simple 
      :title="$t('adminGroups.addTitle')"
    />

    <!-- Content -->
    <admins-groups-form :permissions="permissions" type="add" />
  </div>
</template>

<script>
import AdminsGroupsForm from '@/components/Pages/AdminsGroupsForm'
import PageTitleSimple from '@/components/UI/PageTitleSimple'

export default {
  components: {
    AdminsGroupsForm,
    PageTitleSimple
  },
  asyncData (context) {
    return context.store
      .dispatch('adminGroup/getPermissions')
      .then(res => {
        return { permissions: res }
      })
  }
}
</script>