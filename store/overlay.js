export const state = () => ({
  visible: false,
  text: '',
  color: 'accent',
  type: 'linear',
  opacity: 0.46
})

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
  getType: state => {
    return state.type
  },
  getOpacity: state => {
    return state.opacity
  }
}

export const mutations = {
  SHOW_OVERLAY(state, { text, color, type, opacity }) {
    state.text = text
    state.color = color
    state.type = type
    state.opacity = opacity
    state.visible = true
  },
  HIDE_OVERLAY(state) {
    state.visible = false
  }
}
