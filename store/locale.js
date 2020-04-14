  export const state = () => ({
    locales: ['pl'],
    locale: 'pl',
  })
  
  export const mutations = {
    setLocale(state, value) {
      if (state.locales.includes(value)) {
        return (state.locale = value)
      }
    }
  }
  
  export const getters = {
    getLocale: state => {
      return state.locale
    }
  }