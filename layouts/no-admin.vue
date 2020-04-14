<template>
  <v-app light class="zg">
    <header-nav :avatar="false" />
    <v-content>
      <v-container>
        <nuxt />
        <snack-bar />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import SnackBar from '@/components/UI/SnackBar'
import HeaderNav from '@/components/Sections/Header.vue'

export default {
  components: {
    SnackBar,
    HeaderNav
  }
}
</script>