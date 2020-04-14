<template>
  <div>
    <profile-form :user="user" type="me" />
  </div>
</template>

<script>
import ProfileForm from '@/components/Pages/Profile/Index'

export default {
  components: {
    ProfileForm
  },
  asyncData (context) {
    return { user: context.store.state.user.user }
  }
}
</script>
