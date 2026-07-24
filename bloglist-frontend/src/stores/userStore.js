import { create } from 'zustand'
import loginService from '../services/login'
import blogService from '../services/blogs'
import persistentUser from '../services/persistentUser'

const useUserStore = create((set) => ({
  user: null,

  initializeUser: () => {
    const user = persistentUser.getUser()
    if (user) {
      blogService.setToken(user.token)
      set({ user })
    }
  },

  loginUser: async (username, password) => {
    const user = await loginService.login({ username, password })
    persistentUser.saveUser(user)
    blogService.setToken(user.token)
    set({ user })
    return user
  },

  logoutUser: () => {
    persistentUser.removeUser()
    blogService.setToken(null)
    set({ user: null })
  }
}))

export default useUserStore