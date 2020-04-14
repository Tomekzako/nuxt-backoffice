import Admin from '@/services/admin'

export const state = () => ({
  admins: [],
  headers: [
    { value: 'id' },
    { value: 'first_name' },
    { value: 'last_name' },
    { value: 'email' },
    { value: 'created_at' },
    { value: 'is_active', sortable: false },
    { value: 'group', sortable: false },
    { value: 'avatar', sortable: false }
  ],
  savedFilters: [],
  page: null,
  itemsPerPage: null,
  totalItems: null,
  loading: false,
  loadingBtn: false,
  loadingBtnReset: false,
  loadingFilters: false,
  searchedItems: [
    {
      name: 'email',
      value: ''
    }
  ],
  tableView: true,
  tableViewLoader: false
})

export const getters = {
  tableView(state) {
    return state.tableView
  },
  searchedItems(state) {
    return state.searchedItems
  },
  filteredHeaders(state) {
    return state.headers.slice(1, 4)
  },
  getSelect(state) {
    return state.searchedItems.filter(item => item.active === false)
  },
  getDates(state) {
    return state.dates
  },
  loadingBtn(state) {
    return state.loadingBtn
  },
  loadingFilters(state) {
    return state.loadingFilters
  },
  savedFilters(state) {
    return state.savedFilters
  }
}

export const mutations = {
  SET_ADMINS(state, res) {
    state.admins = []
    state.admins.push(...res.data)
    state.itemsPerPage = parseInt(res.per_page)
    state.page = res.current_page
    state.totalItems = res.total
    state.loading = false
    state.loadingBtn = false
    state.tableViewLoader = false
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
  SET_LOADING(state, boolean) {
    state.loading = boolean
  },
  SET_LOADING_BTN(state, boolean) {
    state.loadingBtn = boolean
  },
  SET_FILTER_LOADER(state, boolean) {
    state.loadingFilters = boolean
  },
  SET_TABLE_VIEW_LOADER(state, boolean) {
    state.tableViewLoader = boolean
  },
  ADD_SEARCH_FIELD(state) {
    state.searchedItems.push({
      name: '',
      value: ''
    })
  },
  SET_SEARCH(state, value) {
    state.searchedItems = []
    state.searchedItems.push(...value)
  },
  RESET_SEARCH(state) {
    state.searchedItems = []
    state.searchedItems.push({
      name: 'email',
      value: ''
    })
  },
  SET_SEARCH_INPUT(state, value) {
    state.searchedItems[value.index].value = value.value
  },
  SET_SEARCH_SELECT(state, value) {
    state.searchedItems[value.index].name = value.name
  },
  SET_FILTERS(state, value) {
    state.savedFilters = []
    state.savedFilters.push(...value)
  },
  SET_TABLE_VIEW(state, boolean) {
    state.tableView = boolean
  }
}

export const actions = {
  async getResults({ rootState, commit }, params) {
    try {
      const { data } = await Admin.all(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        commit('SET_ADMINS', data.data)
      }
    } catch (error) {
      throw error
    }
  },
  async saveFilters({ rootState }, params) {
    try {
      const { data } = await Admin.saveFilter(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data
      }
    } catch (error) {
      throw error
    }
  },

  async deleteAdmin({ rootState }, param) {
    try {
      const { data } = await Admin.delete(param, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data
      }
    } catch (error) {
      throw error
    }
  },

  async deleteFilter({ rootState }, params) {
    try {
      const { data } = await Admin.deleteFilter(params, rootState.auth.tokenData.token)

      if (data.code === 200) {
        return data.data
      }
    } catch (error) {
      throw error
    }
  },
  async getSaved({ rootState, commit }) {
    try {
      const { data } = await Admin.getFilters(rootState.auth.tokenData.token)
      if (data.code === 200) {
        commit('SET_FILTERS', data.data)
        commit('SET_FILTER_LOADER', false)
      }
    } catch (error) {
      throw error
    }
  }
}
