const KEY = 'loggedBlogappUser'

const getUser = () => {
  const userJSON = window.localStorage.getItem(KEY)
  if (userJSON) return JSON.parse(userJSON)
  return null
}

const saveUser = (user) => {
  window.localStorage.setItem(KEY, JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem(KEY)
}

export default { getUser, saveUser, removeUser }