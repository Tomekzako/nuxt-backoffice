import UserService from '@/services/user'

export const state = () => ({
  user: null
})

export const getters = {
  getUser(state) {
    return state.user
  }
}

export const mutations = {
  SET_USER(state, data) {
    state.user = data
  },
  SET_USER_FIRSTNAME(state, data) {
    state.user.first_name = data
  },
  SET_USER_LASTNAME(state, data) {
    state.user.last_name = data
  },
  SET_USER_AVATAR(state, data) {
    state.user.avatar = data
  },
  SET_USER_PERMISSIONS(state, data) {
    state.user.permisions = data
  }
}

export const actions = {

  // user data
  async getUser({ commit, rootState }) {
    try {
      const { data } = await UserService.me(rootState.auth.tokenData.token)
      if(data.code === 200) {
        commit('SET_USER', data.data)
      }
    } catch(error) {
      throw error
    }
  },

  // other user data
  async getUserDetails({ commit, rootState }, param) {
    try {
      const { data } = await UserService.details(param, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data 
      }
    } catch(error) {
      throw error
    }
  },

  // update me
  async updateMe({ commit, rootState }, params) {    
    try {
      const { data } = await UserService.editMe(params, rootState.auth.tokenData.token)
    } catch(error) {
      throw error
    }
  },

  // user update
  async updateUser({ commit, rootState }, params) {    
    try {
      const { data } = await UserService.edit(params, rootState.auth.tokenData.token)
    } catch(error) {
      throw error
    }
  },

  // add user
  async addUser({ commit, rootState }, params) {    
    try {
      const { data } = await UserService.add(params, rootState.auth.tokenData.token)
    } catch(error) {
      throw error
    }
  },

  // update avatar
  async updateAvatar({ commit, rootState }, params) {    
    try {
      const { data } = await UserService.avatar(params, rootState.auth.tokenData.token)
      return data
    } catch(error) {
      throw error
    }
  },

  // user change password
  async changePassword({ commit, rootState }, params) {    
    try {
      const { data } = await UserService.password(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        
      }
    } catch(error) {
      throw error
    }
  }
}