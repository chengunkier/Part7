import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  notification: { message: null, type: null },
  showNotification: (message, type) => {
    set({ notification: { message, type } })
    setTimeout(() => {
      set({ notification: { message: null, type: null } })
    }, 5000)
  },
  clearNotification: () => set({ notification: { message: null, type: null } })
}))

export default useNotificationStore