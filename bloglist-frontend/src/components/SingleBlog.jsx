import { useParams, useNavigate } from 'react-router-dom'
import useBlogStore from '../stores/blogStore'
import useNotificationStore from '../stores/notificationStore'
import useField from '../hooks/useField'

const SingleBlog = ({ user }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const blogs = useBlogStore(state => state.blogs)
  const likeBlog = useBlogStore(state => state.likeBlog)
  const deleteBlog = useBlogStore(state => state.deleteBlog)
  const addComment = useBlogStore(state => state.addComment)
  const showNotification = useNotificationStore(state => state.showNotification)

  const comment = useField('text')
  const { reset: resetComment, ...commentProps } = comment

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

  const handleComment = async (event) => {
    event.preventDefault()
    try {
      await addComment(blog.id, comment.value)
      resetComment()
    } catch (exception) {
      showNotification('adding comment failed', 'error')
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

      <div className="comments-section">
        <h3>comments</h3>
        <form onSubmit={handleComment}>
          <input {...commentProps} placeholder="write a comment" />
          <button type="submit">add comment</button>
        </form>
        <ul>
          {blog.comments && blog.comments.map((c, index) => (
            <li key={index}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SingleBlog