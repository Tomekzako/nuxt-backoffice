import axios from 'axios'

const axiosInstance = axios.create({
  timeout: 30000,
  baseURL: 'https://zerogravity.ptrdigital.xyz/api'
})

// Obsługa globalna błędów znajduje się w @/plugins/errorHandler

export default axiosInstance