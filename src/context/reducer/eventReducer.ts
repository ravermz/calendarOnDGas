import { Event } from '@prisma/client'

/**
 * Definición del estado para el contexto de eventos 🇲🇽
 *
 * @interface IEventState
 * @property {Event[]} events - Lista de eventos actuales
 * @property {boolean} loading - Indica si los eventos están cargando
 * @property {string | null} error - Mensaje de error en la carga de eventos
 */
interface IEventState {
  events: Event[]
  loading: boolean
  error: string | null
}

/**
 * Estado inicial para el reducer de eventos
 *
 * @type {IEventState}
 */
const initialState: IEventState = {
  events: [],
  loading: false,
  error: null,
}

/**
 * Definición de los tipos de acciones que podemos hacer para el reducer de eventos
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
}

/**
 * Definición del tipo de acciones que se pueden despachar al reducer de eventos
 *
 * @typedef {Object} TEventAction
 * @property {EEventActions} type - Tipo de la acción
 * @property {Event[]} [events] - Lista de eventos (para acciones de éxito en la carga)
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
/**
 * Reducer que maneja las acciones relacionadas con los eventos y actualiza el estado
 *
 * @param {IEventState} state - Estado actual de los eventos
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
    default:
      return state
  }
}

export default eventReducer

export { initialState, EEventActions }

export type { IEventState, TEventAction }
