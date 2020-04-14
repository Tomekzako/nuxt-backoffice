import AdminGroup from '@/services/adminGroup'

export const state = () => ({
  items: [],
  headers: [{ value: 'id' }, { value: 'name' }, { value: 'guard_name' }, { value: 'created_at' }, { value: 'updated_at' }],
  page: null,
  itemsPerPage: null,
  totalItems: null,
  loadingBtn: false,
  loadingBtn2: false,
  loading: true,
  search: '',
  select: {
    group: [],
    items: [],
    loading: false
  }
})

export const getters = {
  getSearch(state) {
    return state.search
  }
}
export const mutations = {
  SET_ITEMS(state, res) {
    state.items = []
    state.items.push(...res.data)
    state.itemsPerPage = parseInt(res.per_page)
    state.page = res.current_page
    state.totalItems = res.total
    state.loading = false
    state.loadingBtn = false
    state.loadingBtn2 = false
    state.items = []
    state.items.push(...res.data)
  },
  TRANSLATE_HEADERS(state, headers) {
    const names = []
    for (const key in headers) {
      names.push(headers[key])
    }
    state.headers.forEach((header, index) => {
      header.text = names[index]
    })
  },
  SET_LOADING_BTN(state, value) {
    state.search = value
  },
  SET_LOADING(state, boolean) {
    state.loading = boolean
  },
  SET_LOADING_BTN(state, boolean) {
    state.loadingBtn = boolean
  },
  SET_LOADING_BTN2(state, boolean) {
    state.loadingBtn2 = boolean
  },
  SET_SEARCH(state, value) {
    state.search = value
  }
}
export const actions = {
  async getResults({ rootState, commit }, params) {
    try {
      const { data } = await AdminGroup.all(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        commit('SET_ITEMS', data.data)
        return data
      }
    } catch (error) {
      throw error
    }
  },
  async getPermissions({ rootState }) {
    try {
      const { data } = await AdminGroup.permissions(rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data
      }
    } catch (error) {
      throw error
    }
  },
  async getDetails({ rootState }, param) {
    try {
      const { data } = await AdminGroup.details(param, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data
      }
    } catch (error) {
      throw error
    }
  },
  async updateGroup({ rootState }, params) {
    try {
      const { data } = await AdminGroup.update(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data
      }
    } catch (error) {
      throw error
    }
  },
  async addGroup({ rootState }, param) {
    try {
      const { data } = await AdminGroup.add(param, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data
      }
    } catch (error) {
      throw error
    }
  },
  //no request
  /* async deleteGroup({ rootState }, param) {
    try {
      const { data } = await AdminGroup.remove(param, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data
      }
    } catch (error) {
      throw error
    }
  }, */
  async userToGroup({ rootState }, params) {
    try {
      const { data } = await AdminGroup.saveToGroup(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data
      }
    } catch (error) {
      throw error
    }
  }
}
