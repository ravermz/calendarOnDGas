import { FC, useCallback } from 'react'
import { Event } from '@prisma/client'
import { useEventContext } from '@/context/store/eventStore'

interface EventItemProps {
  event: Event
  handleOnEditClick: (event: Event) => void
}

/**
 * Componente que representa un evento individual con opciones para editar y eliminar
 */
const EventItem: FC<EventItemProps> = ({ event, handleOnEditClick }) => {
  const { deleteEvent } = useEventContext()

  /**
   * Maneja la eliminación del evento
   */
  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      await deleteEvent(event.id)
    }
  }

  const handleEditClick = useCallback(() => {
    handleOnEditClick(event)
  }, [event, handleOnEditClick])

  return (
    <div className="border p-2 mb-2 rounded-lg bg-white shadow">
      <h3 className="font-semibold text-lg">{event.title}</h3>
      <p className="text-sm text-gray-600">{event.description}</p>
      <div className="flex space-x-2 mt-2">
        <button
          className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark"
          onClick={handleEditClick}
        >
          Editar
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={handleDelete}
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

export default EventItem
