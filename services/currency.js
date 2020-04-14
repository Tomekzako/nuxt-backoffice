import axios from '@/plugins/axios'

const Currency = {
  all: (query, token) => {

    const is_query = typeof query !== 'undefined' ? query : ''

    return axios.get('/v1/payment/currencies' + is_query, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  add: (data, token) => {
    return axios.post('/v1/payment/currencies', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  details: (param, token) => {
    return axios.get('/v1/payment/currencies/' + param, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  update: (params, token) => {
    return axios.put('/v1/payment/currencies/' + params.id, params.data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  delete: (param, token) => {
    return axios.delete('/v1/payment/currencies/' + param, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  order: (params, token) => {
    return axios.patch('/v1/payment/currencies/order', params, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export default Currency
