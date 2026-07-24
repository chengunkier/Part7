import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import usersService from '../services/users'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    usersService.getAll().then(users => setUsers(users))
  }, [])

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th style={{ textAlign: 'left', paddingBottom: '10px' }}>Name</th>
            <th style={{ textAlign: 'left', paddingBottom: '10px' }}>Username</th>
            <th style={{ textAlign: 'left', paddingBottom: '10px' }}>Blogs created</th>
          </tr>
          {users.map(user => (
            <tr key={user.id}>
              <td style={{ paddingTop: '10px', paddingBottom: '10px', paddingRight: '60px' }}>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td style={{ paddingTop: '10px', paddingBottom: '10px', paddingRight: '60px' }}>
                {user.username}
              </td>
              <td style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                {user.blogs.length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users