import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Try sessionStorage first, then localStorage
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        console.warn('API request unauthorized (401). Token may be invalid or expired.')
        // Don't auto-redirect or clear token - let the calling code handle it
        // This prevents clearing token on every failed request
        // localStorage.removeItem('authToken')
        // window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// API Functions
export const getStories = async () => {
  const response = await api.get('/stories')
  return response.data
}

export const getAthletes = async () => {
  const response = await api.get('/athletes')
  return response.data
}

export const getCoaches = async () => {
  const response = await api.get('/coaches')
  return response.data
}

export const getEvents = async () => {
  const response = await api.get('/events')
  return response.data
}

export const getProducts = async () => {
  const response = await api.get('/products')
  return response.data
}

export default api
