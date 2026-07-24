import useNotificationStore from '../stores/notificationStore'

const Notification = () => {
  const notification = useNotificationStore(state => state.notification)

  if (notification.message === null) return null

  return (
    <div className={`notification ${notification.type}`}>
      {notification.message}
    </div>
  )
}

export default Notification