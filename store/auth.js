import axios from 'axios'

export const state = () => ({
  tokenData: null
})

export const getters = {
  getTokenData(state) {
    return state.tokenData
  }
}

export const mutations = {
  SET_TOKEN_DATA(state, tokenData) {
    state.tokenData = tokenData
  }
}

export const actions = {
  // logowanie
  async login({ commit }, { email, password, captcha }) {
    try {
      let payload = {
        email,
        password
      }
      if (captcha !== '') {
        payload.captcha = captcha
      }
      const { data } = await axios.post('/api/login', payload)
      commit('SET_TOKEN_DATA', data.tokenData)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  // wysłanie maila do zmiany hasła
  async resetRequest({ commit }, { email }) {
    try {
      let payload = {
        email
      }
      const { data } = await axios.put('/api/resetRequest', payload)
      return data
    } catch (error) {
      throw error
    }
  },

  // zmiana hasła
  async reset({ commit }, { password, t }) {
    try {
      let payload = {
        password,
        t
      }
      const { data } = await axios.put('/api/reset', payload)
      return data
    } catch (error) {
      throw error
    }
  },

  // wylogowanie
  async logout({ commit }) {
    commit('SET_TOKEN_DATA', null)
    await axios.post('/api/logout')
  },

  // odświeżenie tokena
  async refresh({ commit, state }) {
    if (state.tokenData && state.tokenData.token) {
      try {
        const { data } = await axios.put('/api/refresh', { token: state.tokenData.token })
        commit('SET_TOKEN_DATA', data.tokenData)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          throw new Error('Bad credentials')
        }
        throw error
      }
    } else {
      // throw new Error('Bad credentials')
    }
  }
}