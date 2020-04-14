<template>
  <div @click="startLogoutInterval" class="zg">
    <v-app light>
      <header-nav @toggleDrawer="toggleDrawer" />
      <navbar :drawer="drawer" />
      <v-content>
        <v-container>
          <nuxt />
          <snack-bar />
          <overlay />
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import HeaderNav from '@/components/Sections/Header.vue'
import Navbar from '@/components/Sections/Navbar.vue'
import SnackBar from '@/components/UI/SnackBar.vue'
import Overlay from '@/components/UI/Overlay.vue'
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth', 'user', 'permissions'],
  components: {
    HeaderNav,
    Navbar,
    SnackBar,
    Overlay
  },

  computed: {
    ...mapGetters({
      tokenData: 'auth/getTokenData'
    })
  },

  data() {
    return {
      // interwał do odświeżania tokenu
      refreshInterval: null,
      // timeout do wylogowania admina po określonej nieaktywności
      logoutTimeout: null,
      drawer: false
    }
  },

  mounted() {
    //sprawdzanie niektywności usera
    this.checkRefreshToken()
    if (this.logoutTimeout === null) {
      this.startLogoutInterval()
    }
    //odświeżanie tokena
    if (this.refreshInterval !== null) {
      this.refreshInterval = setInterval(() => this.checkRefreshToken(), 1000 * 60 * 2)
    }
  },

  beforeDestroy() {
    clearInterval(this.refreshInterval)
    clearTimeout(this.logoutTimeout)
  },
  watch: {
    $route: function() {
      this.drawer = false
    }
  },

  methods: {
    // co dwie minuty sprawdzany jest wiek tokena w minutach. Jeśli jest mniejszy niż 10 minut to go odświeżamy
    async checkRefreshToken() {
      let expDate = new Date(this.tokenData.exp_date.replace(/-/g, '/')).getTime()
      let currDate = new Date().getTime()
      let diff = Math.round((expDate - currDate) / 60000)

      if (diff <= 10) {
        try {
          await this.$store.dispatch('auth/refresh')
        } catch (error) {
          this.$router.push('/logout')
        }
      }
    },

    //automatyczne wylogowanie admina po 30 minutach nieaktywności
    startLogoutInterval() {
      clearTimeout(this.logoutTimeout)
      this.logoutTimeout = setTimeout(() => {
        this.$router.push('/logout')
      }, 1000 * 60 * 30)
    },
    toggleDrawer() {
      this.drawer = !this.drawer
      console.log(this.drawer)
    }
  }
}
</script>

<style lang="scss">
.zg {
  .v-application {
    p {
      margin-bottom: 0;
    }
    &--wrap {
      background: #f3f3f3;
    }
  }
}
</style>
