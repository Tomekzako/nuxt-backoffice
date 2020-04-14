import PaymentChannel from '@/services/paymentChannel'

export const state = () => ({
})

export const getters = {
}

export const mutations = {
}

export const actions = {
  async getResults({ rootState, commit }, params) {

    const queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&')
    
    try {
      const { data } = await PaymentChannel.all(queryString, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data // important
      }
    } catch (error) {
      throw error
    }
  },

  async getDetails({ rootState }, params) {
    try {
      const { data } = await PaymentChannel.details(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data // important
      }
    } catch (error) {
      throw error
    }
  }
}
