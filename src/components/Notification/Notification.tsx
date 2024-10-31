import { useEffect } from 'react'

import { useEventContext } from '@/context/store/eventStore'

/**
 * Componente de notificaciones 🇲🇽
 * @returns {JSX.Element} - Retorna el componente de notificaciones
 */
const Notification = () => {
  const { state: { notifications }, setNotifications } = useEventContext()

  useEffect(() => {
    if (notifications.length === 0) return

    const timer = setTimeout(() => {
      setNotifications(notifications.slice(1))
    }, 2000)

    return () => clearTimeout(timer)
  }, [notifications])

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`px-4 py-2 rounded shadow-md text-white ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          <h4 className="font-bold">{notification.title}</h4>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  )
}

export default Notification
