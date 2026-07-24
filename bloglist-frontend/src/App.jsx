import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Notification from './components/Notification'
import SingleBlog from './components/SingleBlog'
import CreateBlog from './components/CreateBlog'
import blogService from './services/blogs'
import loginService from './services/login'
import useNotificationStore from './stores/notificationStore'
import useBlogStore from './stores/blogStore'

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

const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
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
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const showNotification = useNotificationStore(state => state.showNotification)
  const blogs = useBlogStore(state => state.blogs)
  const initializeBlogs = useBlogStore(state => state.initializeBlogs)
  const createBlogStore = useBlogStore(state => state.createBlog)
  const likeBlog = useBlogStore(state => state.likeBlog)
  const deleteBlog = useBlogStore(state => state.deleteBlog)

  const navigate = useNavigate()

  useEffect(() => {
    initializeBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (exception) {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
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

  const handleLike = async (updatedBlog) => {
    try {
      await likeBlog(updatedBlog)
    } catch (exception) {
      showNotification('liking blog failed', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id)
      showNotification('blog removed successfully', 'success')
      navigate('/')
    } catch (exception) {
      showNotification('removing blog failed', 'error')
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
            element={
              <SingleBlog
                blogs={blogs}
                user={user}
                handleLike={handleLike}
                handleDelete={handleDelete}
              />
            }
          />
          <Route
            path="/create"
            element={<CreateBlog createBlog={createBlog} />}
          />
          <Route
            path="/login"
            element={
              <LoginForm
                handleLogin={handleLogin}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
              />
            }
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