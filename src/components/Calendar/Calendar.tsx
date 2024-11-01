import { FC, useState, useMemo } from 'react'
import { addMonths, subMonths, format, addDays, addWeeks, subDays, subWeeks } from 'date-fns'
import { es } from 'date-fns/locale'

import { useEventContext } from '@/context/store/eventStore'

import MonthView from './MonthView'
import WeekView from './WeekView'
import DayView from './DayView'
import EventForm from '../Event/EventForm'
import BaseButton from '@/components/Buttons/BaseButton'

type TCalendarView = 'month' | 'week' | 'day'

/**
 * Componente para el calendario 🇲🇽
 * @returns {JSX.Element} - Retorna el componente
 */
const Calendar: FC = (): JSX.Element => {
  const { state: { isFormOpen, selectedDate }, setSelectedDate } = useEventContext()
  
  const [view, setView] = useState<TCalendarView>('month')

  const handleNext = (): void => {
    if (view === 'month') {
      setSelectedDate(addMonths(selectedDate, 1), false)
    } else if (view === 'week') {
      setSelectedDate(addWeeks(selectedDate, 1), false)
    } else if (view === 'day') {
      setSelectedDate(addDays(selectedDate, 1), false)
    }
  }
  
  const handlePrev = (): void => {
    if (view === 'month') {
      setSelectedDate(subMonths(selectedDate, 1), false)
    } else if (view === 'week') {
      setSelectedDate(subWeeks(selectedDate, 1), false)
    } else if (view === 'day') {
      setSelectedDate(subDays(selectedDate, 1), false)
    }
  }

  const renderView = useMemo(() => ({
    month: <MonthView />,
    week: <WeekView />,
    day: <DayView />
  }), [])

  return (
    <div className="bg-background-dark text-text-primary p-4 rounded shadow-lg" role="application" aria-label="Calendario de eventos">
      <CalendarHeader selectedDate={selectedDate} setView={setView} handlePrev={handlePrev} handleNext={handleNext} />
      <div aria-live="polite" aria-atomic="true">
        {renderView[view]}
      </div>
      {isFormOpen && <EventForm />}
    </div>
  )
}

export default Calendar

interface ICalendarHeaderProps {
  selectedDate: Date
  setView: (view: TCalendarView) => void
  handlePrev: () => void
  handleNext: () => void
}

/**
 * Componente para el header del calendario
 * @param {Date} selectedDate - Fecha seleccionada
 * @param {function} setView - Función para establecer la vista
 * @param {function} handlePrev - Función para manejar el previo
 * @param {function} handleNext - Función para manejar el siguiente
 * @returns {JSX.Element} - Retorna el componente
 */
const CalendarHeader = ({ selectedDate, setView, handlePrev, handleNext }: ICalendarHeaderProps): JSX.Element => {
  return (
    <div className="flex items-center mb-4" role="navigation" aria-label="Navegación de calendario">
      <h1 className="text-2xl font-bold flex-1 capitalize" aria-live="polite">
        {format(selectedDate, 'MMMM yyyy', { locale: es })}
      </h1>
      <div className="flex justify-center mb-4 flex-1 gap-2" role="tablist" aria-label="Selector de vista de calendario">
        <BaseButton
          role="tab"
          name="month"
          aria-label="Ver calendario mensual"
          className="px-4 py-1"
          onClick={() => setView('month')}
        >
          Mes
        </BaseButton>
        <BaseButton
          role="tab"
          name="week"
          aria-label="Ver calendario semanal"
          className="px-4 py-1"
          onClick={() => setView('week')}
        >
          Semana
        </BaseButton>
        <BaseButton
          role="tab"
          name="day"
          aria-label="Ver calendario diario"
          className="px-4 py-1"
          onClick={() => setView('day')}
        >
          Día
        </BaseButton>
      </div>
      <div className="flex items-center space-x-2 flex-1 justify-end">
        <BaseButton
          name="prev"
          variant="secondary"
          aria-label="Ir al mes anterior"
          className="px-4 py-2"
          onClick={handlePrev}
        >
          <svg
            className="w-4 h-4 text-text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-hidden="true"
          >
            <title>Anterior</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </BaseButton>
        <BaseButton
          name="today"
          variant="secondary"
          aria-label="Volver a hoy"
          className="px-4 py-1"
          onClick={handleNext}
        >
          Hoy
        </BaseButton>
        <BaseButton
          name="next"
          variant="secondary"
          aria-label="Ir al mes siguiente"
          className="px-4 py-2"
          onClick={handleNext}
        >
          <svg
            className="w-4 h-4 text-text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-hidden="true"
          >
            <title>Siguiente</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </BaseButton>
      </div>
    </div>
  )
}
