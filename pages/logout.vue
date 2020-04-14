<template> </template>

<script>
export default {
  layout: 'no-admin',

  async fetch({ store, params, redirect }) {
    try {
      await store.dispatch('auth/logout')
    } catch (error) {
      
    }
    redirect('/login')
  }
}
</script>
