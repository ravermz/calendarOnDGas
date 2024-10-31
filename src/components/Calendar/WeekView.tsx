import { FC, useMemo, LegacyRef } from 'react'
import { addDays, startOfWeek, format, isSameDay, isToday, setMinutes, setSeconds, setMilliseconds } from 'date-fns'
import { es } from 'date-fns/locale'
import { Event } from '@prisma/client'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { useEventContext } from '@/context/store/eventStore'
import { capitalizeFirstLetter } from '@/utils'

/**
 * Componente para la vista de semana del calendario 🇲🇽
 * @returns {JSX.Element} - Retorna el componente
 */
const WeekView = (): JSX.Element => {
  const {
    state: { selectedDate },
  } = useEventContext()

  const daysOfWeek = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }, [selectedDate])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex">
        <div className="flex flex-col w-16 border-r border-border" role="grid" aria-label="Horas del día">
          <div className="h-12" aria-hidden="true"></div>
          {[...Array(24)].map((_, hour) => (
            <div key={`weekview-hour-${hour}`} className="h-16 flex items-start justify-center text-xs text-text-secondary" role="rowheader" aria-label={`${hour}:00`}>
              {`${hour}:00`}
            </div>
          ))}
        </div>

        <div className="flex-1" role="grid" aria-label="Vista semanal del calendario">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {daysOfWeek.map((day) => (
              <div
                key={`header-${day.getTime()}`}
                className="text-center font-semibold h-12 flex items-center justify-center text-text-primary"
                role="columnheader"
                aria-label={`${capitalizeFirstLetter(format(day, 'EEEE d MMMM yyyy', { locale: es }))}`}
              >
                {capitalizeFirstLetter(format(day, 'EEE d', { locale: es }))}
                {isToday(day) && <span className="bg-accent w-3 h-3 rounded-full inline-block ml-1" aria-label="Hoy"></span>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day) => (
              <DayColumn key={`weekview-day-${day.getTime()}`} day={day} />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  )
}

export default WeekView

interface IDayColumnProps {
  day: Date
}

/**
 * Componente para las columnas de días del calendario
 * @param {Date} day - Día
 * @returns {JSX.Element} - Retorna el componente
 */
const DayColumn: FC<IDayColumnProps> = ({ day }) => {
  const {
    state: { events },
    setEventToEdit,
    setIsFormOpen,
  } = useEventContext()

  const eventsForDay = events.filter((event) => isSameDay(new Date(event.startDate), day))

  const handleOnEventClick = (event: Event) => {
    setEventToEdit(event)
    setIsFormOpen(true)
  }

  return (
    <div className="border border-border relative" role="gridcell" aria-label={`Día ${format(day, 'EEEE d MMMM yyyy', { locale: es })}`}>
      <div className="grid grid-rows-24 gap-1 relative">
        {[...Array(24)].map((_, hour) => (
          <HourRow
            key={hour}
            hour={hour}
            day={day}
            eventsForDay={eventsForDay}
            handleOnEventClick={handleOnEventClick}
          />
        ))}
      </div>
    </div>
  )
}

interface IHourRowProps {
  hour: number
  day: Date
  eventsForDay: Event[]
  handleOnEventClick: (event: Event) => void
}

/**
 * Componente para la fila de horas del calendario
 * @param {number} hour - Hora
 * @param {Date} day - Día
 * @param {Event[]} eventsForDay - Eventos
 * @param {function} handleOnEventClick - Función para manejar el click en el evento
 * @returns {JSX.Element} - Retorna el componente
 */
const HourRow: FC<IHourRowProps> = ({ hour, day, eventsForDay, handleOnEventClick }) => {
  const { updateEventTime, setSelectedDate } = useEventContext()

  const [, drop] = useDrop({
    accept: 'event',
    drop: (item: Event) => {
      const newStartDate = setMilliseconds(setSeconds(setMinutes(new Date(day), 0), 0), 0)
      newStartDate.setHours(hour)
      const duration = new Date(item.endDate).getTime() - new Date(item.startDate).getTime()
      const newEndDate = new Date(newStartDate.getTime() + duration)
      updateEventTime(item.id, newStartDate, newEndDate)
    },
  })

  const handleClick = () => {
    const selectedDate = new Date(day)
    selectedDate.setHours(hour, 0, 0, 0)
    setSelectedDate(selectedDate)
  }

  return (
    <div
      ref={drop as unknown as LegacyRef<HTMLDivElement>}
      className="border-b border-border p-1 cursor-pointer hover:bg-background relative"
      style={{ height: '60px' }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${hour}:00, ${format(day, 'EEEE d MMMM yyyy', { locale: es })}`}
    >
      <div className="relative">
        {eventsForDay
          .map((event, index) => (
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
    const leftOffset = index > 0 ? 15 * index : 0

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
        title={event.title}
        role="button"
        tabIndex={0}
        aria-label={`Evento: ${event.title} a las ${format(new Date(event.startDate), 'HH:mm', { locale: es })}`}
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

