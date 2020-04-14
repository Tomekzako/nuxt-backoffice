import Upload from '@/services/upload'

export const state = () => ({
  
})

export const getters = {}
export const mutations = {}

export const actions = {
  async uploadFile({ rootState }, params) {
    try {
      const { data } = await Upload.uploadFile(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data
      }
    } catch (error) {
      throw error
    }
  }
}
