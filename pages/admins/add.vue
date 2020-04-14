<template>
  <profile-form :group="group" type="add" />
</template>

<script>
import ProfileForm from '@/components/Pages/Profile/Index'

export default {
  components: {
    ProfileForm
  },
  async asyncData (context) {
    return context.store
      .dispatch('adminGroup/getResults')
      .then(res => {
        return {
          group: res.data.data
        }
    })
  }
}
</script>