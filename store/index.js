import Vue from 'vue'

export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req, redirect }) {
    // jeśli jest sesja, to od razu ustawiamy token
    if (req.session && req.session.tokenData) {
      commit('auth/SET_TOKEN_DATA', req.session.tokenData)
    }
  }
}
