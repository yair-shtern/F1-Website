import axios from 'axios'

/**
 * API Helper utilities for managing API interactions
 */
class APIHelpers {
  /**
   * Create an axios instance with default configurations
   * @param {string} baseURL 
   * @returns {axios.AxiosInstance}
   */
  static createAxiosInstance(baseURL) {
    const instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    // Request interceptor for adding authentication
    instance.interceptors.request.use(
      config => {
        const token = this.getAuthToken()
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    // Response interceptor for error handling
    instance.interceptors.response.use(
      response => response,
      error => {
        this.handleAPIError(error)
        return Promise.reject(error)
      }
    )

    return instance
  }

  /**
   * Retrieve authentication token from storage
   * @returns {string|null}
   */
  static getAuthToken() {
    return localStorage.getItem('f1_auth_token')
  }

  /**
   * Handle API errors
   * @param {Error} error 
   */
  static handleAPIError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('API Error Response:', error.response.data)
      console.error('Status Code:', error.response.status)
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request)
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message)
    }
  }

  /**
   * Retry an API call with exponential backoff
   * @param {Function} apiCall 
   * @param {number} maxRetries 
   * @returns {Promise}
   */
  static async retryAPICall(apiCall, maxRetries = 3) {
    let retries = 0
    
    while (retries < maxRetries) {
      try {
        return await apiCall()
      } catch (error) {
        retries++
        
        if (retries >= maxRetries) {
          throw error
        }
        
        // Exponential backoff
        const waitTime = Math.pow(2, retries) * 1000
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }
}

export default APIHelpers