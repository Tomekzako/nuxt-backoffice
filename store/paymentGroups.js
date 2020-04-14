import PaymentGroups from '~/services/paymentGroups'

export const state = () => ({
  items: [],
  headers: [{ value: 'id' }, { value: 'name' }, { value: 'sort', align: 'right' }],
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
  },
  getItemsSimple(state) {
    return state.items
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
  },
  SET_ITEMS_SIMPLE(state, value) {
    state.items = value
  }
}
export const actions = {
  async getResults({ rootState, commit }, params) {
    try {
      const { data } = await PaymentGroups.all(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        commit('SET_ITEMS', data.data)
        return data
      }
    } catch (error) {
      throw error
    }
  },
  async getDetails({ rootState }, params) {
    try {
      const { data } = await PaymentGroups.details(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data
      }
    } catch (error) {
      throw error
    }
  },
  async createGroup({ rootState }, params) {
    try {
      const { data } = await PaymentGroups.create(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data
      }
    } catch (error) {
      throw error
    }
  },
  async updateGroup({ rootState }, params) {
    try {
      const { data } = await PaymentGroups.update(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data
      }
    } catch (error) {
      throw error
    }
  },
  async deleteGroup({ rootState }, params) {
    try {
      const { data } = await PaymentGroups.delete(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data
      }
    } catch (error) {
      throw error
    }
  },
  async orderCurrency({ rootState }, params) {
    try {
      const { data } = await PaymentGroups.order(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data
      }
    } catch (error) {
      throw error
    }
  }
}
