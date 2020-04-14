export const state = () => ({
  visible: false,
  text: 'aa',
  color: 'error', // error | warning | etc.,
  time: 3000
})

export const mutations = {
  showSnackbar(state, { text, color, time }) {
    state.text = text
    state.color = color
    state.time = time ? time : 3000
    state.visible = true
  },

  hideSnackbar(state, value) {
    state.text = ''
    state.color = ''
    state.visible = false
  },

  setColor(state, value) {
    state.color = value
  },

  setText(state, value) {
    state.text = value
  },

  setTime(state, value) {
    state.time = value
  }
}

export const getters = {
  getVisible: state => {
    return state.visible
  },

  getText: state => {
    return state.text
  },

  getColor: state => {
    return state.color
  },

  getTime: state => {
    return state.time
  }
}
