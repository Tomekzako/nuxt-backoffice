import axios from '@/plugins/axios'

const PaymentMethod = {
  all: (query, token) => {

    const is_query = query.length ? '?' + query : ''

    return axios.get('/v1/payment/ways' + is_query, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  details: (param, token) => {
    return axios.get('/v1/payment/ways/' + param, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export default PaymentMethod
