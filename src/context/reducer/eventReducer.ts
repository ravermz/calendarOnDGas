import { Event } from '@prisma/client'

/**
 * Definición del estado para el contexto de events 🇲🇽
 *
 * @interface IEventState
 * @property {Event[]} events - Lista de events actuales
 * @property {boolean} loading - Indica si los events están cargando
 * @property {string | null} error - Mensaje de error en la carga de events
 */
interface IEventState {
  events: Event[]
  loading: boolean
  error: string | null
  eventToEdit: Event | null
  selectedDate: Date
  isFormOpen: boolean
  notifications: {
    title: string
    message: string
    type: 'success' | 'error'
    id: string
  }[]
  isFetching: boolean
}

/**
 * Estado inicial para el reducer de events
 *
 * @type {IEventState}
 */
const initialState: IEventState = {
  events: [],
  loading: false,
  error: null,
  eventToEdit: null,
  selectedDate: new Date(),
  isFormOpen: false,
  notifications: [],
  isFetching: false,
}

/**
 * Definición de las actions que podemos hacer para el reducer de events
 *
 * @enum {string}
 */
enum EEventActions {
  FETCH_EVENTS_REQUEST = 'FETCH_EVENTS_REQUEST',
  FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS',
  FETCH_EVENTS_FAILURE = 'FETCH_EVENTS_FAILURE',
  ADD_EVENT = 'ADD_EVENT',
  UPDATE_EVENT = 'UPDATE_EVENT',
  DELETE_EVENT = 'DELETE_EVENT',
  SET_EVENTS = 'SET_EVENTS',
  SET_EVENT_TO_EDIT = 'SET_EVENT_TO_EDIT',
  UPDATE_EVENT_TIME = 'UPDATE_EVENT_TIME',
  SET_SELECTED_DATE = 'SET_SELECTED_DATE',
  SET_IS_FORM_OPEN = 'SET_IS_FORM_OPEN',
  SET_NOTIFICATIONS = 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION = 'ADD_NOTIFICATION',
  SET_IS_FETCHING = 'SET_IS_FETCHING',
}

/**
 * Definición de las actions con sus payloads
 *
 * @typedef {Object} TEventAction
 * @property {EEventActions} type - Tipo de la acción
 * @property {Event[]} [events] - Lista de events (para acciones de éxito en la carga)
 * @property {string} [error] - Mensaje de error (para acciones de falla en la carga)
 * @property {Event} [event] - Evento individual (para agregar o actualizar un evento)
 * @property {number} [id] - ID del evento (para eliminar un evento)
 */
type TEventAction =
  | { type: EEventActions.FETCH_EVENTS_SUCCESS; events: Event[] }
  | { type: EEventActions.FETCH_EVENTS_FAILURE; error: string }
  | { type: EEventActions.ADD_EVENT; event: Event }
  | { type: EEventActions.UPDATE_EVENT; event: Event }
  | { type: EEventActions.DELETE_EVENT; id: number }
  | { type: EEventActions.SET_EVENTS; events: Event[] }
  | { type: EEventActions.SET_EVENT_TO_EDIT; event: Event }
  | { type: EEventActions.UPDATE_EVENT_TIME; event: Event }
  | { type: EEventActions.SET_SELECTED_DATE; date: Date; isFormOpen?: boolean }
  | { type: EEventActions.SET_IS_FORM_OPEN; isFormOpen: boolean }
  | { type: EEventActions.SET_NOTIFICATIONS; notifications: { title: string; message: string; type: 'success' | 'error'; id: string }[] }
  | { type: EEventActions.ADD_NOTIFICATION; notification: { title: string; message: string; type: 'success' | 'error' } }
  | { type: EEventActions.SET_IS_FETCHING; isFetching: boolean }
/**
 * Reducer que maneja las acciones relacionadas con los events y actualiza el estado
 *
 * @param {IEventState} state - Estado actual de los events
 * @param {TEventAction} action - Acción a procesar
 * @returns {IEventState} Nuevo estado después de aplicar la acción
 */
const eventReducer = (state: IEventState, action: TEventAction): IEventState => {
  switch (action.type) {
    case EEventActions.FETCH_EVENTS_SUCCESS:
      return { ...state, loading: false, events: action.events }
    case EEventActions.FETCH_EVENTS_FAILURE:
      return { ...state, loading: false, error: action.error }
    case EEventActions.ADD_EVENT:
      return { ...state, events: [...state.events, action.event] }
    case EEventActions.UPDATE_EVENT:
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.event.id ? { ...action.event } : event
        ),
      }
    case EEventActions.DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.id),
      }
    case EEventActions.SET_EVENTS:
      return { ...state, events: action.events }
    case EEventActions.SET_EVENT_TO_EDIT:
      return { ...state, eventToEdit: action.event }
    case EEventActions.UPDATE_EVENT_TIME: {
      const updatedEvents = state.events.map((event) =>
        event.id === action.event.id ? { ...event, startDate: action.event.startDate, endDate: action.event.endDate } : event
      )
      return { ...state, events: updatedEvents, eventToEdit: null }
    }
    case EEventActions.SET_SELECTED_DATE:
      return { ...state, selectedDate: action.date, isFormOpen: action.isFormOpen ?? true }
    case EEventActions.SET_IS_FORM_OPEN:
      return { ...state, isFormOpen: action.isFormOpen, ...(!action.isFormOpen && { eventToEdit: null }) }
    case EEventActions.SET_NOTIFICATIONS:
      return { ...state, notifications: action.notifications }
    case EEventActions.ADD_NOTIFICATION:
      return { ...state, notifications: [...state.notifications, { ...action.notification, id: Date.now().toString() }] }
    case EEventActions.SET_IS_FETCHING:
      return { ...state, isFetching: action.isFetching }
    default:
      return state
  }
}

export default eventReducer

export { initialState, EEventActions }

export type { IEventState, TEventAction }
