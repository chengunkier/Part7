import useField from '../hooks/useField'

const CreateBlog = ({ createBlog }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({
      title: title.value,
      author: author.value,
      url: url.value
    })
    title.reset()
    author.reset()
    url.reset()
  }

  const { reset: resetTitle, ...titleProps } = title
  const { reset: resetAuthor, ...authorProps } = author
  const { reset: resetUrl, ...urlProps } = url

  return (
    <div className="create-form">
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>title:</label>
          <input {...titleProps} name="Title" placeholder="title" />
        </div>
        <div className="form-group">
          <label>author:</label>
          <input {...authorProps} name="Author" placeholder="author" />
        </div>
        <div className="form-group">
          <label>url:</label>
          <input {...urlProps} name="Url" placeholder="url" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default CreateBlog