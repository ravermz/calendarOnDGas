import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isToday, getDay, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { Event } from '@prisma/client'

import { useEventContext } from '@/context/store/eventStore'

/**
 * Componente para la vista de mes del calendario 🇲🇽
 * @returns {JSX.Element} - Retorna el componente
 */
const MonthView = (): JSX.Element => {
  const {
    state: { events, selectedDate },
  } = useEventContext()

  return (
    <div>
      <DaysOfWeek selectedDate={selectedDate} />
      <MonthDay selectedDate={selectedDate} events={events} />
    </div>
  )
}

export default MonthView

interface IDaysOfWeekProps {
  selectedDate: Date
}

/**
 * Componente para las columnas de días de la semana del calendario
 * @param {Date} selectedDate - Fecha seleccionada
 * @returns {JSX.Element} - Retorna el componente
 */
const DaysOfWeek = ({ selectedDate }: IDaysOfWeekProps): JSX.Element => {
  const firstDayOfMonth = startOfMonth(selectedDate)
  const firstWeekDayIndex = getDay(firstDayOfMonth)

  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    format(addDays(firstDayOfMonth, (i + firstWeekDayIndex) % 7), 'EEE', { locale: es })
  )

  return (
    <div className="grid grid-cols-7 gap-1 mb-2" aria-label="Días de la semana">
      {daysOfWeek.map((day, index) => (
        <div key={index} className="text-center font-bold text-secondary" aria-label={day}>
          {day.charAt(0).toUpperCase() + day.slice(1)}
        </div>
      ))}
    </div>
  )
}

interface IMonthDayProps {
  selectedDate: Date
  events: Event[]
}

/**
 * Componente para las columnas de días del calendario
 * @param {Date} selectedDate - Fecha seleccionada
 * @param {Event[]} events - Eventos
 * @returns {JSX.Element} - Retorna el componente
 */
const MonthDay = ({ selectedDate, events }: IMonthDayProps): JSX.Element => {
  const monthDays = eachDayOfInterval({
    start: startOfMonth(selectedDate),
    end: endOfMonth(selectedDate),
  })

  return (
    <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Vista mensual de días">
      {monthDays.map((day, index) => {
        const dayEvents = events.filter((event) => isSameDay(new Date(event.startDate), day))
        const maxVisibleEvents = 2
        const extraEvents = dayEvents.length - maxVisibleEvents
        const visibleEvents = dayEvents.slice(0, maxVisibleEvents)
        const isTodayDate = isToday(day)

        return (
          <div role="row" key={`row-${index}`}>
            <div
              key={`${day.toISOString()}-${dayEvents.length}-${index}`}
              className="border p-2 rounded-lg cursor-pointer transition duration-300 flex flex-col bg-background-dark hover:bg-background"
              style={{ height: '100px' }}
              role="gridcell"
              aria-label={`${format(day, 'EEEE d MMMM yyyy', { locale: es })}`}
            >
              <div className="text-xs font-bold mb-1 text-end">
                <span
                  className={`${isTodayDate ? 'bg-accent text-white rounded-full px-2 py-1' : 'text-secondary'}`}
                  aria-current={isTodayDate ? 'date' : undefined}
                >
                  {format(day, 'd')}
                </span>
              </div>
              {visibleEvents && (
                <div className="flex-1 overflow-hidden">
                  {visibleEvents.map((event) => (
                    <EventCard event={event} day={day} key={`${event.id}-${day.toISOString()}`} />
                  ))}
                  {extraEvents > 0 && (
                    <div className="text-xs text-text-secondary mt-1" aria-label={`más ${extraEvents} eventos`}>
                      +{extraEvents} eventos
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface IEventCardProps {
  event: Event
  day: Date
}

/**
 * Componente para el evento del calendario
 * @param {Event} event - Evento
 * @param {Date} day - Día
 * @returns {JSX.Element} - Retorna el componente
 */
const EventCard = ({ event, day }: IEventCardProps): JSX.Element => {
  return (
    <div
      key={`${event.id}-${day.toISOString()}`}
      className="text-xs bg-primary text-white px-1 py-0.5 rounded mb-1 truncate"
      title={event.title}
      role="button"
      tabIndex={0}
      aria-label={`Evento: ${event.title}`}
    >
      {event.title}
    </div>
  )
}
