<template>
  <div class="zg_wrapper">
    
    <!-- Header -->
    <page-title-simple :title="$t('adminGroups.editTitle')"/>

    <!-- Content -->
    <admins-groups-form :selectedValue="selected" :nameValue="name" :permissions="permissions" type="edit" />
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
  async asyncData (context) {
    let [permissions, selected] = await Promise.all([
      context.store.dispatch('adminGroup/getPermissions'),
      context.store.dispatch('adminGroup/getDetails', context.route.params.id)
    ])
    return {
      permissions: permissions,
      selected: selected.permissions,
      name: selected.name
    }
  },
  data() {
    return {
      id: this.$route.params.id
    }
  },
  methods: {
    remove() {
      this.$store
        .dispatch('adminGroup/deleteGroup', this.id)
        .then(res => {
          if (res.code === 200) {
            const snackbar = {
              text: this.$t('adminGroups.info.saveSuccess'),
              color: 'primary'
            }
            this.$store.commit('snackbar/showSnackbar', snackbar)
            this.$router.back()
          }
        })
    }
  }
}
</script>