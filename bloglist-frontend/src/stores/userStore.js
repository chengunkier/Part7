import { create } from 'zustand'
import loginService from '../services/login'
import blogService from '../services/blogs'

const useUserStore = create((set) => ({
  user: null,

  initializeUser: () => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      set({ user })
    }
  },

  loginUser: async (username, password) => {
    const user = await loginService.login({ username, password })
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    blogService.setToken(user.token)
    set({ user })
    return user
  },

  logoutUser: () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    set({ user: null })
  }
}))

export default useUserStore