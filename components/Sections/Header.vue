<template>
  <v-app-bar fixed app dark clipped-left height="94" class="secondary zg_header">
    <nuxt-link to="/">
      <logo />
    </nuxt-link>
    <v-spacer />
    <v-btn icon class="d-flex d-md-none" @click="$emit('toggleDrawer')">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-menu v-if="avatar" transition="slide-y-transition" offset-y>
      <template v-slot:activator="{ on }">
        <v-btn :ripple="false" text v-on="on" class="mr-md-1 pr-0 d-md-flex" height="94" x-small>
          <v-avatar size="45" class="mr-1">
            <img :src="user.avatar" :alt="user.first_name" />
          </v-avatar>
          <p class="d-none d-md-flex body-1 text-capitalize mr-3">{{ user.first_name }}</p>
          <v-icon class="d-none d-md-flex">mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list class="zg_header-menu">
        <v-list-item>
          <v-list-item-title>
            <nuxt-link to="/profile" class="secondary--text">{{ $t('buttons.profile') }}</nuxt-link>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <nuxt-link to="/logout" class="secondary--text">{{ $t('buttons.logOut') }}</nuxt-link>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import Logo from '@/components/UI/Logo.vue'

export default {
  components: {
    Logo
  },
  props: {
    avatar: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  methods: {},

  computed: {
    user() {
      return this.$store.state.user.user
    }
  }
}
</script>

<style lang="scss">
.zg {
  .zg_header-menu {
    .v-list-item {
      padding: 0 1rem;
      min-width: 14rem;
      &:nth-of-type(1) {
        border-bottom: 1px solid #9c9c9c;
      }
    }
    a {
      font-family: 'Montserrat', sans-serif;
      font-size: 1.4rem;
      text-decoration: none;
    }
  }
}
</style>
