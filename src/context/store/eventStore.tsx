import React, { useReducer, createContext, useContext, useMemo } from 'react'

import eventReducer, {
  initialState,
  IEventState,
  TEventAction,
} from '@/context/reducer/eventReducer'

/**
 * Definición el context para los eventos 🇲🇽
 *
 * @interface IContextProps
 * @property {IEventState} state - Estado actual de los eventos
 * @property {React.Dispatch<TEventAction>} dispatch - Función para despachar acciones al reducer de eventos
 */
interface IContextProps {
  state: IEventState
  dispatch: React.Dispatch<TEventAction>
}

/**
 * Contexto de React para compartir el estado de los eventos
 *
 * @type {React.Context<IContextProps>}
 */
const EventStore = createContext({} as IContextProps)

/**
 * Hook personalizado para acceder al contexto de eventos
 *
 * @returns {IContextProps} El contexto de eventos
 */
const useEventContext = (): IContextProps => useContext(EventStore)

/**
 * Componente proveedor del contexto de eventos que envuelve la aplicación
 *
 * @param {Object} props - Props del componente
 * @param {React.JSX.Element} props.children - Componentes hijos que serán envueltos por el proveedor
 * @returns {JSX.Element} El proveedor del contexto de eventos
 */
const EventState = ({ children }: { children: React.JSX.Element }): JSX.Element => {
  const [state, dispatch] = useReducer(eventReducer, initialState)
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return <EventStore.Provider value={value}>{children}</EventStore.Provider>
}

export default EventState
export { EventStore, useEventContext }
