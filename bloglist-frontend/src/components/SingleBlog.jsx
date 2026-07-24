import { useParams, useNavigate } from 'react-router-dom'
import useBlogStore from '../stores/blogStore'
import useNotificationStore from '../stores/notificationStore'

const SingleBlog = ({ user }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const blogs = useBlogStore(state => state.blogs)
  const likeBlog = useBlogStore(state => state.likeBlog)
  const deleteBlog = useBlogStore(state => state.deleteBlog)
  const showNotification = useNotificationStore(state => state.showNotification)

  const blog = blogs.find(b => b.id === id)

  if (!blog) return null

  const handleLike = async () => {
    try {
      await likeBlog({
        ...blog,
        user: blog.user ? blog.user.id || blog.user._id : null,
        likes: blog.likes + 1
      })
    } catch (exception) {
      showNotification('liking blog failed', 'error')
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await deleteBlog(blog.id)
        showNotification('blog removed successfully', 'success')
        navigate('/')
      } catch (exception) {
        showNotification('removing blog failed', 'error')
      }
    }
  }

  const showDeleteButton = user && blog.user && user.username === blog.user.username

  return (
    <div className="single-blog">
      <h2 className="single-blog-title">{blog.title}</h2>
      <p className="single-blog-author">by {blog.author}</p>
      <a className="single-blog-url" href={blog.url}>{blog.url}</a>
      <p className="single-blog-added">Added by {blog.user && blog.user.name}</p>
      <div className="single-blog-actions">
        <span className="single-blog-likes">{blog.likes} likes</span>
        {user && (
          <button className="btn-like" onClick={handleLike}>like</button>
        )}
        {showDeleteButton && (
          <button className="btn-remove" onClick={handleDelete}>remove</button>
        )}
      </div>
    </div>
  )
}

export default SingleBlog