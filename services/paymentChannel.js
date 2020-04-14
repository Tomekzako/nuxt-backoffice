import axios from '@/plugins/axios'

const PaymentChannel = {
  all: (query, token) => {

    const is_query = query.length ? '?' + query : ''

    return axios.get('/v1/payment/channels' + is_query, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  details: (param, token) => {
    return axios.get('/v1/payment/channels/' + param, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export default PaymentChannel
