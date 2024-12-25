import React, { createContext, useState, useContext, useEffect } from 'react'
import APIHelpers from '../utils/apiHelpers'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication on mount
    const checkAuthStatus = async () => {
      try {
        const token = APIHelpers.getAuthToken()
        if (token) {
          // Validate token with backend
          const userData = await validateToken(token)
          setUser(userData)
          setIsAuthenticated(true)
        }
      } catch (error) {
        // Clear invalid token
        localStorage.removeItem('f1_auth_token')
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (credentials) => {
    try {
      const response = await APIHelpers.createAxiosInstance('/api').post('/login', credentials)
      const { token, user } = response.data

      // Store token and user data
      localStorage.setItem('f1_auth_token', token)
      setUser(user)
      setIsAuthenticated(true)

      return user
    } catch (error) {
      console.error('Login failed', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('f1_auth_token')
    setUser(null)
    setIsAuthenticated(false)
  }

  const validateToken = async (token) => {
    try {
      const response = await APIHelpers.createAxiosInstance('/api').post('/validate-token', { token })
      return response.data.user
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      logout
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext