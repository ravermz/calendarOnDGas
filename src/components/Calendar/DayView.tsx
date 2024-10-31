import { FC, useMemo, LegacyRef, useCallback } from 'react'
import { format, isSameDay, isWithinInterval, startOfHour, endOfHour, isToday } from 'date-fns'
import { es } from 'date-fns/locale'
import { Event } from '@prisma/client'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { useEventContext } from '@/context/store/eventStore'
import { capitalizeFirstLetter } from '@/utils'

/**
 * Componente para la vista de día del calendario 🇲🇽
 * @returns {JSX.Element} - Retorna el componente
 */
const DayView = (): JSX.Element => {
  const {
    state: { events, selectedDate },
    updateEventTime,
    setSelectedDate,
    setEventToEdit,
    setIsFormOpen,
  } = useEventContext()

  const dayEvents = useMemo(
    () => events.filter((event) => isSameDay(event.startDate, selectedDate)),
    [events, selectedDate]
  )

  const getEventsForHour = useCallback((hour: number): Event[] => {
    const hourStart = startOfHour(new Date(selectedDate.getTime()))
    hourStart.setHours(hour, 0, 0, 0)
  
    const hourEnd = endOfHour(new Date(selectedDate.getTime()))
    hourEnd.setHours(hour, 0, 0, 0)
  
    return dayEvents.filter((event) =>
      isWithinInterval(new Date(event.startDate), { start: hourStart, end: hourEnd }) ||
      isWithinInterval(new Date(event.endDate), { start: hourStart, end: hourEnd })
    )
  }, [dayEvents, selectedDate])

  const handleOnEventClick = (event: Event) => {
    setEventToEdit(event)
    setIsFormOpen(true)
  }

  return (
    <div className="h-full" aria-label="Vista diaria del calendario">
      <h2 className="text-2xl font-bold mb-4 text-secondary" aria-live="polite">
        {isToday(selectedDate) ? 'Hoy, ' : ''}
        {capitalizeFirstLetter(format(selectedDate, 'EEEE, d MMMM yyyy', { locale: es }))}
      </h2>
      
      <div className="flex">
        <div className="flex flex-col w-16 border-r border-border" role="grid" aria-label="Horas del día">
          {[...Array(24)].map((_, hour) => (
            <div key={hour} className="h-16 flex items-center justify-center text-xs text-text-secondary" role="rowheader" aria-label={`${hour}:00`}>
              {`${hour}:00`}
            </div>
          ))}
        </div>

        <DndProvider backend={HTML5Backend}>
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-rows-24">
              {[...Array(24)].map((_, hour) => (
                <HourRow
                  key={`dayview-hour-${hour}`}
                  hour={hour}
                  events={getEventsForHour(hour)}
                  selectedDate={selectedDate}
                  onDateClick={setSelectedDate}
                  updateEventTime={updateEventTime}
                  handleOnEventClick={handleOnEventClick}
                />
              ))}
            </div>
          </div>
        </DndProvider>
      </div>
    </div>
  )
}

export default DayView

interface IHourRowProps {
  hour: number
  events: Event[]
  selectedDate: Date
  onDateClick: (date: Date) => void
  updateEventTime: (id: number, newStartDate: Date, newEndDate: Date) => void
  handleOnEventClick: (event: Event) => void
}

/**
 * Componente para la fila de horas del calendario
 * @param {number} hour - Hora
 * @param {Event[]} events - Eventos
 * @param {Date} selectedDate - Fecha seleccionada
 * @param {function} onDateClick - Función para manejar el click en la fecha
 * @param {function} updateEventTime - Función para actualizar el horario del evento
 * @param {function} handleOnEventClick - Función para manejar el click en el evento
 * @returns {JSX.Element} - Retorna el componente
 */
const HourRow: FC<IHourRowProps> = ({ hour, events, selectedDate, onDateClick, updateEventTime, handleOnEventClick }) => {
  const [, drop] = useDrop({
    accept: 'event',
    drop: (item: Event) => {
      const newStartDate = new Date(selectedDate)
      newStartDate.setHours(hour, 0, 0, 0)
      const duration = new Date(item.endDate).getTime() - new Date(item.startDate).getTime()
      const newEndDate = new Date(newStartDate.getTime() + duration)
      updateEventTime(item.id, newStartDate, newEndDate)
    },
  })

  const handleClick = () => {
    const newSelectedDate = new Date(selectedDate)
    newSelectedDate.setHours(hour, 0, 0, 0)
    onDateClick(newSelectedDate)
  }

  return (
    <div
      ref={drop as unknown as LegacyRef<HTMLDivElement>}
      className="border-b border-border cursor-pointer hover:bg-background relative"
      style={{ height: '64px' }}
      onClick={handleClick}
      role="gridcell"
      aria-label={`Hora ${hour}:00`}
    >
      <div className="relative">
        {events.map((event, index) => (
          <DraggableEvent
            key={event.id}
            event={event}
            index={index}
            hour={hour}
            handleOnEventClick={handleOnEventClick}
          />
        ))}
      </div>
    </div>
  )
}

interface IDraggableEventProps {
  event: Event
  index: number
  hour: number
  handleOnEventClick: (event: Event) => void
}

/**
 * Componente para el evento arrastrable del calendario
 * @param {Event} event - Evento
 * @param {number} index - Índice
 * @param {number} hour - Hora
 * @param {function} handleOnEventClick - Función para manejar el click en el evento
 * @returns {JSX.Element} - Retorna el componente
 */
const DraggableEvent: FC<IDraggableEventProps> = ({ event, index, hour, handleOnEventClick }) => {
  const [, drag] = useDrag({
    type: 'event',
    item: event,
  })

  const style = useMemo(() => {
    const eventStart = new Date(event.startDate)
    const eventEnd = new Date(event.endDate)
    const eventStartHour = eventStart.getHours() + eventStart.getMinutes() / 60 + eventStart.getSeconds() / 3600
    const eventEndHour = eventEnd.getHours() + eventEnd.getMinutes() / 60 + eventEnd.getSeconds() / 3600
    const eventDuration = eventEndHour - eventStartHour
    const topOffset = (eventStartHour - hour) * 60
    const eventHeight = eventDuration <= 23 ? eventDuration * 63 : 24 * 63
    const leftOffset = index > 0 ? 100 * index : 0

    return {
      top: `${topOffset}px`,
      height: `${eventHeight}px`,
      width: `calc(100% - ${leftOffset + 15}px)`,
      left: `${leftOffset}px`,
      zIndex: index + 1,
    }
  }, [event, hour, index])

  const colors = ['bg-primary-dark', 'bg-accent-dark', 'bg-blue-900', 'bg-green-700', 'bg-purple-700']
  const colorClass = colors[index % colors.length]

  if (new Date(event.startDate).getHours() === hour) {
    return (
      <div
        onClick={() => handleOnEventClick(event)}
        ref={drag as unknown as LegacyRef<HTMLDivElement>}
        className={`${colorClass} text-text-primary text-xs px-1 py-1 rounded shadow-sm absolute`}
        style={style}
        role="button"
        tabIndex={0}
        aria-label={`Evento: ${event.title} desde las ${format(new Date(event.startDate), 'HH:mm', { locale: es })}`}
      >
        <div className="absolute top-0 left-2 text-left">
          {event.title}
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => handleOnEventClick(event)}
      ref={drag as unknown as LegacyRef<HTMLDivElement>}
    />
  )
}

