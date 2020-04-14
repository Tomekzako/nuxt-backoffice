import Language from '@/services/language'

export const state = () => ({
  items: [],
  headers: [
    { text: 'ID', value: 'id' },
    { text: 'Nazwa', value: 'name' },
    { text: 'Kod języka', value: 'code' },
    { text: '', value: 'sort', sortable: false }
  ],
  page: null,
  itemsPerPage: null,
  totalItems: null,
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
}

export const actions = {
  async getResults({ rootState, commit }, params) {
    try {
      const { data } = await Language.all(params, rootState.auth.tokenData.token)
      if (data.code === 200) {
        commit('SET_ITEMS', data.data)
        return data.data // important
      }
    } catch (error) {
      throw error
    }
  },
  async addLanguage({ rootState }, params) {
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
  }
}
