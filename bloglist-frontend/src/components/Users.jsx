import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import usersService from '../services/users'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    usersService.getAll().then(users => setUsers(users))
  }, [])

  return (
    <div className="users-page">
      <h2>Users</h2>
      <table className="users-table">
        <tbody>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Blogs created</th>
          </tr>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.username}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users