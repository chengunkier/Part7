import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Notification from './components/Notification'
import SingleBlog from './components/SingleBlog'
import CreateBlog from './components/CreateBlog'
import useNotificationStore from './stores/notificationStore'
import useBlogStore from './stores/blogStore'
import useUserStore from './stores/userStore'

const Navigation = ({ user, handleLogout }) => {
  return (
    <nav>
      <Link to="/" className="nav-brand">Blog App</Link>
      <div className="nav-links">
        <Link to="/">blogs</Link>
        {user && <Link to="/create">new blog</Link>}
        {user
          ? <button onClick={handleLogout}>logout</button>
          : <Link to="/login">login</Link>
        }
      </div>
    </nav>
  )
}

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const loginUser = useUserStore(state => state.loginUser)
  const showNotification = useNotificationStore(state => state.showNotification)

  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      await loginUser(username, password)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (exception) {
      showNotification('wrong username or password', 'error')
    }
  }

  return (
    <div className="login-form">
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>username</label>
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div className="form-group">
          <label>password</label>
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

const BlogList = ({ blogs }) => {
  return (
    <div>
      <h2>blogs</h2>
      <ul>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>
                {blog.title} by {blog.author}
              </Link>
            </li>
          )
        }
      </ul>
    </div>
  )
}

const AppContent = () => {
  const showNotification = useNotificationStore(state => state.showNotification)
  const blogs = useBlogStore(state => state.blogs)
  const initializeBlogs = useBlogStore(state => state.initializeBlogs)
  const createBlogStore = useBlogStore(state => state.createBlog)
  const user = useUserStore(state => state.user)
  const initializeUser = useUserStore(state => state.initializeUser)
  const logoutUser = useUserStore(state => state.logoutUser)

  const navigate = useNavigate()

  useEffect(() => {
    initializeBlogs()
  }, [])

  useEffect(() => {
    initializeUser()
  }, [])

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await createBlogStore(blogObject)
      showNotification(
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
        'success'
      )
      navigate('/')
    } catch (exception) {
      showNotification('creating blog failed', 'error')
    }
  }

  return (
    <div>
      <Navigation user={user} handleLogout={handleLogout} />
      <div className="content">
        <Notification />
        <Routes>
          <Route
            path="/"
            element={<BlogList blogs={blogs} />}
          />
          <Route
            path="/blogs/:id"
            element={<SingleBlog user={user} />}
          />
          <Route
            path="/create"
            element={<CreateBlog createBlog={createBlog} />}
          />
          <Route
            path="/login"
            element={<LoginForm />}
          />
        </Routes>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App