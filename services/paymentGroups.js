import axios from '@/plugins/axios'

const PaymentGroups = {
  all: (query, token) => {
    const is_query = typeof query !== 'undefined' ? query : ''

    return axios.get('/v1/payment/groups' + is_query, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  details: (id, token) => {
    return axios.get('/v1/payment/groups/' + id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  create: (params, token) => {
    return axios.post('/v1/payment/groups', params, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  update: (params, token) => {
    return axios.put('/v1/payment/groups/' + params.id, params, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  delete: (id, token) => {
    return axios.delete('/v1/payment/groups/' + id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  order: (params, token) => {
    return axios.patch('/v1/payment/groups/order', params, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export default PaymentGroups
