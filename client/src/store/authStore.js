import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const API_URL = 'http://localhost:5000/api'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,

      register: async (userData) => {
        try {
          const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
            credentials: 'include'
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Registration failed')
          }

          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
            role: data.role
          })
          return data
        } catch (error) {
          console.error('Registration error:', error)
          throw error
        }
      },

      login: async (credentials) => {
        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
            credentials: 'include'
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Login failed')
          }

          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
            role: data.role
          })
          return data
        } catch (error) {
          console.error('Login error:', error)
          throw error
        }
      },

      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        role: null
      })
    }),
    {
      name: 'auth-store'
    }
  )
) 