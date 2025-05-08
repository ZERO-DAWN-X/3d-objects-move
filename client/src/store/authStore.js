import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: null, // 'admin' or 'user'
      isAuthenticated: false,

      login: (userData) => set({
        user: userData,
        role: userData.role,
        isAuthenticated: true
      }),

      logout: () => set({
        user: null,
        role: null,
        isAuthenticated: false
      })
    }),
    {
      name: 'auth-storage'
    }
  )
) 