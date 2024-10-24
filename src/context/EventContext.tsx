// context/EventContext.tsx

import React, { createContext, useReducer, useContext, Dispatch } from 'react';
import { Event } from '@prisma/client';
import axios from 'axios';

/**
 * Estado inicial del contexto de eventos.
 *
 * @typedef {Object} EventState
 * @property {Event[]} events - Lista de eventos actuales.
 * @property {boolean} loading - Indica si los eventos están cargando.
 * @property {string | null} error - Error en la carga de eventos.
 */
interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

/**
 * Tipos de acciones para el reducer de eventos.
 */
type ActionType =
  | { type: 'FETCH_EVENTS_REQUEST' }
  | { type: 'FETCH_EVENTS_SUCCESS'; payload: Event[] }
  | { type: 'FETCH_EVENTS_FAILURE'; payload: string }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: number };

/**
 * Tipo del contexto de eventos.
 *
 * @typedef {Object} EventContextType
 * @property {EventState} state - Estado actual de los eventos.
 * @property {Dispatch<ActionType>} dispatch - Función para despachar acciones al reducer.
 */
interface EventContextType {
  state: EventState;
  dispatch: Dispatch<ActionType>;
}

/**
 * Estado inicial del contexto de eventos.
 */
const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
};

/**
 * Reducer para manejar el estado de los eventos.
 *
 * @param {EventState} state - Estado actual.
 * @param {ActionType} action - Acción a procesar.
 * @returns {EventState} Nuevo estado.
 */
const eventReducer = (state: EventState, action: ActionType): EventState => {
  switch (action.type) {
    case 'FETCH_EVENTS_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_EVENTS_SUCCESS':
      return { ...state, loading: false, events: action.payload };
    case 'FETCH_EVENTS_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
      };
    default:
      return state;
  }
};

/**
 * Contexto para manejar el estado global de los eventos.
 */
const EventContext = createContext<EventContextType | undefined>(undefined);

/**
 * Proveedor del contexto de eventos que envuelve la aplicación.
 *
 * @param {React.ReactNode} children - Componentes hijos que serán envueltos por el proveedor.
 * @returns {JSX.Element} Componente proveedor del contexto de eventos.
 */
export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  /**
   * Función para cargar los eventos desde la API.
   */
  const fetchEvents = async () => {
    dispatch({ type: 'FETCH_EVENTS_REQUEST' });
    try {
      const response = await axios.get<Event[]>('/api/events');
      dispatch({ type: 'FETCH_EVENTS_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_EVENTS_FAILURE', payload: 'Error al cargar los eventos.' });
    }
  };

  // Cargar los eventos al montar el proveedor
  React.useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <EventContext.Provider value={{ state, dispatch }}>
      {children}
    </EventContext.Provider>
  );
};

/**
 * Hook personalizado para acceder al contexto de eventos.
 *
 * @returns {EventContextType} El contexto de eventos.
 * @throws {Error} Si el hook se utiliza fuera del EventProvider.
 */
export const useEventContext = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext debe usarse dentro de un EventProvider');
  }
  return context;
};
