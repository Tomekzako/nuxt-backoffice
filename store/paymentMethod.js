import PaymentMethod from '@/services/paymentMethod'

export const state = () => ({
  items: [],
  headers: [
    { text: 'ID', value: 'id' },
    { text: 'Nazwa', value: 'name' },
    { text: 'Status', value: 'is_active', sortable: false },
    { text: '', value: 'sort', sortable: false }
  ],
  page: null,
  itemsPerPage: null,
  totalItems: null,
  totalPages: null,
  loadingBtn: false,
  loadingBtn2: false,
  loading: true,
  search: ''
})

export const getters = {
  getSearch(state) {
    return state.search
  },
  getItemsSimple(state) {
    return state.items
  },
  getOptions(state) {
    return state.options
  },
  getPage(state) {
    return state.page
  },
  getItemsPerPage(state) {
    return state.itemsPerPage
  },
  getTotalPages(state) {
    return state.totalPages
  }
}
export const mutations = {
  SET_ITEMS(state, res) {
    state.itemsPerPage = res.per_page
    state.page = res.current_page
    state.totalItems = res.total
    state.loading = false
    state.loadingBtn = false
    state.loadingBtn2 = false
    state.items = []
    state.totalPages = res.total
    state.items.push(...res.data)
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
  },
  SET_ITEMS_SIMPLE(state, value) {
    state.items = value
  },
  SET_ITEMS_SIMPLE(state, value) {
    state.items = value
  },
  SET_OPTIONS(state, value) {
    state.options = value
  },
  SET_PAGE(state, value) {
    //state.options.page = value
    state.page = value
  },
  SET_ITEMS_PER_PAGE(state, value) {
    //state.options.itemsPerPage = value
    state.itemsPerPage = value
  }
}

export const actions = {
  async getResults({ rootState, commit }, params) {
  
    const queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&')
    
    try {
      const { data } = await PaymentMethod.all(queryString, rootState.auth.tokenData.token)
      if (data.code === 200) {
        commit('SET_ITEMS', data.data)
        return data.data // important
      }
    } catch (error) {
      throw error
    }
  },

  async getDetails({ rootState }, params) {
    try {
      const { data } = await PaymentMethod.details(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data
      }
    } catch (error) {
      throw error
    }
  }
  /* async addLanguage({ rootState }, params) {
    try {
      const { data } = await Language.add(params, rootState.auth.tokenData.token)
    } catch (error) {
      throw error
    }
  },
  async getDetails({ rootState }, params) {
    try {
      const { data } = await Language.details(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data
      }
    } catch (error) {
      throw error
    }
  },
  async updateLanguage({ rootState }, params) {
    try {
      const { data } = await Language.update(params, rootState.auth.tokenData.token)
    } catch (error) {
      throw error
    }
  },
  async deleteLanguage({ rootState }, params) {
    try {
      const { data } = await Language.delete(params, rootState.auth.tokenData.token)
      if(data.code === 200) {
        return data
      }

    } catch (error) {
      throw error
    }
  },
  async orderLanguage({ rootState }, params) {
    try {
      const { data } = await Language.order(params, rootState.auth.tokenData.token)
      if(data.code === 200) {
        return data
      }

    } catch (error) {
      throw error
    }
  } */
}
