import axios from '@/plugins/axios'

const Company = {
  details: (param, token) => {
    return axios.get('/v1/admins/companies/' + param, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  updateBase: (params, token) => {
    return axios.put('/v1/admins/companies/' + params.id, params.data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  addSmtp: (params, token) => {
    return axios.post('/v1/admins/companies/' + params.id + '/smtp', params.data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  updateSmtp: (params, token) => {
    return axios.put('/v1/admins/companies/' + params.id + '/smtp', params.data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  updateLogo: (params, token) => {
    return axios.post('/v1/admins/companies/' + params.id + '/logo', params.data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export default Company
