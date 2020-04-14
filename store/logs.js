import Logs from '@/services/logs'

export const state = () => ({
  logs: [],
  savedFilters: [],
  headers: [
    { value: 'id' },
    { value: 'url', sortable: false },
    { value: 'method', sortable: false },
    { value: 'params', sortable: false },
    { value: 'user', sortable: false },
    { value: 'ip', sortable: false },
    { value: 'date' }
  ],
  dates: [],
  page: null,
  itemsPerPage: null,
  totalItems: null,
  loading: false,
  loadingBtn: false,
  loadingBtnReset: false,
  loadingFilters: false,
  searchedItems: [{ name: 'url', value: '' }],
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
  getSelect(state) {
    return state.searchedItems.filter(item => item.active === false)
  },
  filteredHeaders(state) {
    return state.headers.slice(1, 6)
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
  SET_LOGS(state, res) {
    state.logs = []
    state.logs.push(...res.data)
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
      name: 'url',
      value: '',
      active: false
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
  },
  SET_DATES(state, value) {
    if (state.dates.length === 2) {
      state.dates = []
    }
    state.dates = [...value]
  },
  SET_DATE_FROM(state, value) {
    state.dates.unshift(value)
  },
  SET_DATE_TO(state, value) {
    state.dates.push(value)
  }
}

export const actions = {
  async getResults({ rootState, commit }, params) {
    try {
      const { data } = await Logs.all(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        commit('SET_LOGS', data.data)
      }
    } catch (error) {
      throw error
    }
  },
  async saveFilters({ rootState }, params) {
    try {
      const { data } = await Logs.saveFilter(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data
      }
    } catch (error) {
      throw error
    }
  },
  async deleteFilter({ rootState }, params) {
    try {
      const { data } = await Logs.deleteFilter(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        return data.data
      }
    } catch (error) {
      throw error
    }
  },
  async getSaved({ rootState, commit }) {
    try {
      const { data } = await Logs.getFilters(rootState.auth.tokenData.token)
      if (data.code === 200) {
        commit('SET_FILTERS', data.data)
        commit('SET_FILTER_LOADER', false)
      }
    } catch (error) {
      throw error
    }
  },
  async exportList({ rootState, commit }, params) {
    try {
      const response = await Logs.export(params, rootState.auth.tokenData.token)
      if (response.status === 200) {
        commit('overlay/HIDE_OVERLAY', null, { root: true })
        const resInfo = response.headers['content-type']
        if (resInfo === 'application/json') {
          const snackbar = {
            text: params.text,
            color: 'info',
            time: 5000
          }
          commit('snackbar/showSnackbar', snackbar, { root: true })
          return
        } else {
          const today = new Date().toISOString().substr(0, 10)
          const url = window.URL.createObjectURL(new Blob([response.data]))
          console.log(url)
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `${params.from}-${today}.${params.type}`)
          document.body.appendChild(link)
          link.click()
        }
      }
    } catch (error) {
      throw error
    }
  }
}
