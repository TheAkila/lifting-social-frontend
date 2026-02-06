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
    // Don't log 404 errors as they're expected for missing resources
    const is404 = error.response?.status === 404
    
    // Log all errors for debugging (except 404s)
    if (error.response && !is404) {
      // Server responded with error status
      console.error('🚨 API Error:', {
        url: error.config?.url || 'unknown',
        method: error.config?.method || 'unknown',
        status: error.response?.status || 'unknown',
        statusText: error.response?.statusText || 'unknown',
        data: error.response?.data || 'no data',
        message: error.message || 'no message'
      })
    } else if (error.request && !is404) {
      // Request made but no response
      console.error('🚨 Network Error - No response:', {
        url: error.config?.url,
        method: error.config?.method,
        message: error.message
      })
    } else if (!is404) {
      // Error in request setup
      console.error('🚨 Request Setup Error:', error.message)
    }
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        console.error('API request unauthorized (401). Token may be invalid or expired.')
        
        // Clear all auth data
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
        localStorage.removeItem('supabaseToken')
        localStorage.removeItem('refreshToken')
        sessionStorage.removeItem('authToken')
        sessionStorage.removeItem('userData')
        sessionStorage.removeItem('supabaseToken')
        sessionStorage.removeItem('refreshToken')
        
        // Add a more descriptive error message
        error.authError = true
        error.message = 'Your session has expired. Please log in again.'
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
