import { format, toZonedTime, fromZonedTime } from 'date-fns-tz'

interface IScheduleSectionProps {
  startDate: Date
  endDate: Date
  allDay: boolean
  handleStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleAllDayToggle: () => void
  timezone: string
}

/**
 * Sección de horario del formulario 🇲🇽
 * @param {Date} startDate - Fecha de inicio del evento
 * @param {Date} endDate - Fecha de fin del evento
 * @param {boolean} allDay - Indica si el evento es todo el día
 * @param {function} handleStartDateChange - Función para manejar el cambio de la fecha de inicio
 * @param {function} handleEndDateChange - Función para manejar el cambio de la fecha de fin
 * @param {function} handleAllDayToggle - Función para manejar el cambio de la opción de todo el día
 */
const ScheduleSection = ({ startDate, endDate, allDay, handleStartDateChange, handleEndDateChange, handleAllDayToggle, timezone }: IScheduleSectionProps) => {
  const formatDateToLocalInputValue = (date: Date) => {
    const zonedDate = toZonedTime(date, timezone)
    return format(zonedDate, "yyyy-MM-dd'T'HH:mm")
  }

  const formatTimeToLocalInputValue = (date: Date) => {
    const zonedDate = toZonedTime(date, timezone)
    return zonedDate.toTimeString().slice(0, 5)
  }

  return (
    <div role="group" aria-labelledby="schedule-section-label">
      <h3 id="schedule-section-label" className="sr-only">Sección de Horario</h3>
      
      <div className="flex">
        <div className="flex-1">
          <label htmlFor="start-date" className="block text-sm font-medium mb-1 text-text-secondary">
            Horario Inicio
          </label>
          <input
            type="datetime-local"
            id="start-date"
            className="w-full bg-background-dark border border-border p-2 rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            value={formatDateToLocalInputValue(startDate)}
            onChange={handleStartDateChange}
            disabled={allDay}
            aria-describedby="all-day-description"
            required
          />
        </div>  

        <div className="flex-1 ml-2">
          <label htmlFor="end-time" className="block text-sm font-medium mb-1 text-text-secondary">
            Horario Fin (solo hora)
          </label>
          <input
            type="time"
            id="end-time"
            className="w-full bg-background-dark border border-border p-2 rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            value={formatTimeToLocalInputValue(endDate)}
            onChange={handleEndDateChange}
            disabled={allDay}
            aria-describedby="all-day-description"
            required
          />
        </div>
      </div>

      <div className="mb-4 flex items-center mt-2">
        <label htmlFor="all-day-checkbox" className="block text-sm font-medium text-text-secondary mr-2">
          Todo el día
        </label>
        <input
          type="checkbox"
          id="all-day-checkbox"
          className="toggle-switch focus:ring-2 focus:ring-primary"
          checked={allDay}
          onChange={handleAllDayToggle}
          aria-describedby="all-day-description"
        />
        <span id="all-day-description" className="sr-only">
          Activa para habilitar el evento como un evento de todo el día y deshabilitar la selección de horarios específicos.
        </span>
      </div>
    </div>
  )
}

export default ScheduleSection
