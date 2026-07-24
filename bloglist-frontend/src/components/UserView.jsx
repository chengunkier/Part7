import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import usersService from '../services/users'

const UserView = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    usersService.getAll().then(users => {
      const found = users.find(u => u.id === id)
      setUser(found)
    })
  }, [id])

  if (!user) return null

  return (
    <div>
      <h2>{user.name}</h2>
      <p>added blogs</p>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserView