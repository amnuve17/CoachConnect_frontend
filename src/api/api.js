import axios from 'axios'

const api = axios.create({
  baseURL: 'https://coachconnect-backend-musk.onrender.com/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
