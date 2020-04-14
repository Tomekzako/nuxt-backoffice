import Company from '@/services/company'

export const state = () => ({
  
})

export const getters = {}
export const mutations = {}

export const actions = {
  async getDetails({ rootState }, params) {
    try {
      const { data } = await Company.details(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data
      }
    } catch (error) {
      throw error
    }
  },
  async updateBaseInfo({ rootState }, params) {
    try {
      const { data } = await Company.updateBase(params, rootState.auth.tokenData.token)
      return data
    } catch (error) {
      throw error
    }
  },
  async addSmtp({ rootState }, params) {
    try {
      const { data } = await Company.addSmtp(params, rootState.auth.tokenData.token)
      return data
    } catch (error) {
      throw error
    }
  },
  async updateSmtp({ rootState }, params) {
    try {
      const { data } = await Company.updateSmtp(params, rootState.auth.tokenData.token)
      return data
    } catch (error) {
      throw error
    }
  },
  async updateLogo({ rootState }, params) {
    try {
      const { data } = await Company.updateLogo(params, rootState.auth.tokenData.token)
      return data
    } catch (error) {
      throw error
    }
  }
}
