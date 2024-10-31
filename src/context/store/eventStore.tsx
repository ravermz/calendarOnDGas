import React, { useReducer, createContext, useContext, useMemo } from 'react'
import axios from 'axios'
import { Event } from '@prisma/client'

import eventReducer, {
  initialState,
  IEventState,
  TEventAction,
  EEventActions,
} from '@/context/reducer/eventReducer'

/**
 * Definición del context para los events 🇲🇽
 *
 * @interface IContextProps
 * @property {IEventState} state - Estado actual de los events
 * @property {React.Dispatch<TEventAction>} dispatch - Función para despachar acciones al reducer de events
 */
interface IContextProps {
  state: IEventState
  dispatch: React.Dispatch<TEventAction>
  setEvents: (events: Event[]) => void
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>
  deleteEvent: (id: number) => Promise<void>
  updateEvent: (event: Event) => Promise<void>
  setEventToEdit: (event: Event) => void
  updateEventTime: (id: number, newStartDate: Date, newEndDate: Date) => Promise<void>
  setSelectedDate: (date: Date, isFormOpen?: boolean) => void
  setIsFormOpen: (isFormOpen: boolean) => void
  setNotifications: (notifications: { title: string; message: string; type: 'success' | 'error'; id: string }[]) => void
  addNotification: (notification: { title: string; message: string; type: 'success' | 'error' }) => void
  setIsFetching: (isFetching: boolean) => void
}

/**
 * Contexto de React para compartir el estado de los events
 *
 * @type {React.Context<IContextProps>}
 */
const EventStore = createContext({} as IContextProps)

/**
 * Hook personalizado para acceder al contexto de events
 *
 * @returns {IContextProps} El contexto de events
 */
const useEventContext = (): IContextProps => useContext(EventStore)

/**
 * Componente proveedor (wrapper or higher order component) del contexto de events que envuelve la aplicación
 *
 * @param {Object} props - Props del componente
 * @param {React.JSX.Element} props.children - Componentes hijos que serán envueltos por el proveedor
 * @returns {JSX.Element} El proveedor del contexto de events
 */
const EventState = ({ children }: { children: React.JSX.Element }): JSX.Element => {
  const [state, dispatch] = useReducer(eventReducer, initialState)

  /**
   * Función para establecer los eventos
   *
   * @param {Event[]} events - Eventos a establecer
   */
  const setEvents = (events: Event[]): void => {
    dispatch({ type: EEventActions.SET_EVENTS, events })
  }

  /**
   * Función para agregar un nuevo evento
   *
   * @param {Omit<Event, 'id'>} event - Evento a agregar
   */
  const addEvent = async (event: Omit<Event, 'id'>): Promise<void> => {
    try {
      const response = await axios.post<Event>('/api/events', event)
      dispatch({ type: EEventActions.ADD_EVENT, event: response.data })
      addNotification({ title: 'Evento agregado', message: 'El evento ha sido agregado correctamente', type: 'success' })
    } catch (error) {
      dispatch({ type: EEventActions.FETCH_EVENTS_FAILURE, error: 'Error al agregar el evento' })
      addNotification({ title: 'Error al agregar el evento', message: 'Hubo un error al agregar el evento', type: 'error' })
      console.error('Error al agregar el evento:', error)
    }
  }

  /**
   * Función para eliminar un evento
   *
   * @param {number} id - ID del evento a eliminar
   */
  const deleteEvent = async (id: number): Promise<void> => {
    try {
      await axios.delete(`/api/events/${id}`)
      dispatch({ type: EEventActions.DELETE_EVENT, id })
      addNotification({ title: 'Evento eliminado', message: 'El evento ha sido eliminado correctamente', type: 'success' })
    } catch (error) {
      dispatch({ type: EEventActions.FETCH_EVENTS_FAILURE, error: 'Error al eliminar el evento' })
      addNotification({ title: 'Error al eliminar el evento', message: 'Hubo un error al eliminar el evento', type: 'error' })
      console.error('Error al eliminar el evento:', error)
    }
  }

  /**
   * Función para actualizar un evento existente
   *
   * @param {Event} event - Evento a actualizar
   */
  const updateEvent = async (event: Event): Promise<void> => {
    try {
      const response = await axios.put<Event>(`/api/events/${event.id}`, event)
      dispatch({ type: EEventActions.UPDATE_EVENT, event: response.data })
      addNotification({ title: 'Evento actualizado', message: 'El evento ha sido actualizado correctamente', type: 'success' })
    } catch (error) {
      dispatch({ type: EEventActions.FETCH_EVENTS_FAILURE, error: 'Error al actualizar el evento' })
      addNotification({ title: 'Error al actualizar el evento', message: 'Hubo un error al actualizar el evento', type: 'error' })
      console.error('Error al actualizar el evento:', error)
    }
  }

  /**
   * Función para establecer el evento a editar
   *
   * @param {Event} event - Evento a establecer
   */
  const setEventToEdit = (event: Event): void => {
    dispatch({ type: EEventActions.SET_EVENT_TO_EDIT, event })
  }

  /**
   * Función para actualizar el horario de un evento existente
   *
   * @param {number} id - ID del evento a actualizar
   * @param {Date} newStartDate - Nueva fecha/hora de inicio del evento
   * @param {Date} newEndDate - Nueva fecha/hora de finalización del evento
   */
  const updateEventTime = async (id: number, newStartDate: Date, newEndDate: Date): Promise<void> => {
    try {
      const response = await axios.put<Event>(`/api/events/${id}`, { startDate: newStartDate, endDate: newEndDate })
      dispatch({ type: EEventActions.UPDATE_EVENT_TIME, event: response.data })
      addNotification({ title: 'Evento actualizado', message: 'El evento ha sido actualizado correctamente', type: 'success' })
    } catch (error) {
      dispatch({ type: EEventActions.FETCH_EVENTS_FAILURE, error: 'Error al actualizar el horario del evento' })
      addNotification({ title: 'Error al actualizar el horario del evento', message: 'Hubo un error al actualizar el horario del evento', type: 'error' })
      console.error('Error al actualizar el horario del evento:', error)
    }
  }

  /**
   * Función para establecer la fecha seleccionada
   *
   * @param {Date} date - Fecha a establecer
   * @param {boolean} isFormOpen - Indica si el formulario está abierto
   */
  const setSelectedDate = (date: Date, isFormOpen?: boolean): void => {
    dispatch({ type: EEventActions.SET_SELECTED_DATE, date, isFormOpen })
  }

  /**
   * Función para establecer si el formulario está abierto
   *
   * @param {boolean} isFormOpen - Indica si el formulario está abierto
   */
  const setIsFormOpen = (isFormOpen: boolean): void => {
    dispatch({ type: EEventActions.SET_IS_FORM_OPEN, isFormOpen })
  }

  /**
   * Función para establecer las notificaciones
   *
   * @param {Array<{ title: string; message: string; type: 'success' | 'error'; id: string }>} notifications - Notificaciones a establecer
   */
  const setNotifications = (notifications: { title: string; message: string; type: 'success' | 'error'; id: string }[]): void => {
    dispatch({ type: EEventActions.SET_NOTIFICATIONS, notifications })
  }

  /**
   * Función para agregar una notificación
   *
   * @param {Object} notification - Notificación a agregar
   */
  const addNotification = (notification: { title: string; message: string; type: 'success' | 'error' }): void => {
    dispatch({ type: EEventActions.ADD_NOTIFICATION, notification })
  }

  /**
   * Función para establecer si se está realizando una petición
   *
   * @param {boolean} isFetching - Indica si se está realizando una petición
   */
  const setIsFetching = (isFetching: boolean): void => {
    dispatch({ type: EEventActions.SET_IS_FETCHING, isFetching })
  }

  const value = useMemo(
    () => ({
      state,
      dispatch,
      setEvents,
      addEvent,
      deleteEvent,
      updateEvent,
      setEventToEdit,
      updateEventTime,
      setSelectedDate,
      setIsFormOpen,
      setNotifications,
      addNotification,
      setIsFetching,
    }),
    [state, dispatch]
  )

  return <EventStore.Provider value={value}>{children}</EventStore.Provider>
}

export default EventState
export { EventStore, useEventContext }
