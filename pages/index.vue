<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-container>
          <v-row justify="space-between">
            <v-col cols="auto">
              <!-- <code>{{ tokenData }}</code> -->
              <v-btn @click="refreshToken">Refresh token</v-btn>
              <v-btn to="/test" nuxt>Test site</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  layout: 'default',
  computed: {
    ...mapGetters({
      tokenData: 'auth/getTokenData'
    })
  },

  methods: {
    async refreshToken() {
      try {
        const response = await this.$store.dispatch('auth/refresh')
      } catch (e) {}
    }
  }
}
</script>
