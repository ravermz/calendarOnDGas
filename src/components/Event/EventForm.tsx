import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Event } from '@prisma/client'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'
import { timeZonesNames } from '@vvo/tzdb'


import { useEventContext } from '@/context/store/eventStore'

import BaseButton from '@/components/Buttons/BaseButton'
import LocationSection from './LocationSection'
import ScheduleSection from './ScheduleSection'

/**
 * Componente para el formulario de eventos 🇲🇽
 * @returns {JSX.Element | null} - Retorna el componente o null si no hay un evento para editar
 */

const EventForm = (): JSX.Element | null => {
  const { setIsFormOpen, addEvent, updateEvent, deleteEvent, setIsFetching, state: { eventToEdit, selectedDate, isFetching } } = useEventContext()

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date(startDate.getTime() + 60 * 60 * 1000))
  const [allDay, setAllDay] = useState<boolean>(false)
  const [city, setCity] = useState<string>('')
  const [weather, setWeather] = useState<{ temperature: number; condition: string; icon: string } | null>(null)
  const [timezone, setTimezone] = useState<string>(eventToEdit?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone)

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title)
      setDescription(eventToEdit.description || '')
      setStartDate(new Date(eventToEdit.startDate))
      setEndDate(new Date(eventToEdit.endDate))
      setAllDay(eventToEdit.allDay || false)
      setCity(eventToEdit.location || '')
      if (eventToEdit.temperature && eventToEdit.condition && eventToEdit.icon) {
        setWeather({
          temperature: eventToEdit.temperature,
          condition: eventToEdit.condition,
          icon: eventToEdit.icon
        })
      }
    } else {
      setTitle('')
      setDescription('')
      setStartDate(selectedDate)
      setEndDate(new Date(selectedDate.getTime() + 59 * 60 * 1000))
      setAllDay(false)
      setCity('')
    }
  }, [eventToEdit, selectedDate])

  /**
   * Función para manejar el envío del formulario
   *
   * @param {React.FormEvent<HTMLFormElement>} e - Evento del formulario
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    const newEvent = {
      title,
      description,
      startDate,
      endDate,
      allDay,
      location: city,
      timezone,
      temperature: weather?.temperature ?? null,
      condition: weather?.condition ?? null,
      icon: weather?.icon ?? null
    }
    if (eventToEdit) {
      await updateEvent({ ...eventToEdit, ...newEvent })
    } else {
      await addEvent(newEvent)
    }
    setIsFormOpen(false)
  }

  /**
   * Función para manejar la eliminación de un evento
   */
  const handleDelete = async () => {
    if (eventToEdit) {
      await deleteEvent(eventToEdit.id)
      setIsFormOpen(false)
    }
  }

  /**
   * Función para manejar el cambio de la fecha de inicio
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento del input
   */
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const inputDate = fromZonedTime(new Date(inputValue), timezone)
  
    setStartDate(inputDate)
  
    const zonedDate = toZonedTime(inputDate, timezone)
    const hours = zonedDate.getHours()
  
    if (inputDate >= endDate) {
      let newEndDateUtc
  
      if (hours === 23) {
        zonedDate.setHours(23, 59, 0, 0)
        newEndDateUtc = fromZonedTime(zonedDate, timezone)
      } else {
        newEndDateUtc = new Date(inputDate.getTime() + 60 * 60 * 1000)
      }
  
      setEndDate(newEndDateUtc)
    }
  }

  /**
   * Función para manejar el cambio de la fecha de fin
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento del input
   */
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = new Date(e.target.value)
    const utcDate = fromZonedTime(inputDate, timezone)
  
    const zonedDate = toZonedTime(utcDate, timezone)
    const hours = zonedDate.getHours()
    const minutes = zonedDate.getMinutes()
  
    if (hours > 23 || (hours === 23 && minutes > 59)) {
      const endOfDayZoned = new Date(zonedDate)
      endOfDayZoned.setHours(23, 59, 0, 0)
      const adjustedUtcDate = fromZonedTime(endOfDayZoned, timezone)
      setEndDate(adjustedUtcDate)
    } else {
      setEndDate(utcDate)
    }
  }

  /**
   * Función para manejar el cambio de la opción de todo el día
   */
  const handleAllDayToggle = () => {
    setAllDay(!allDay)
    if (!allDay) {
      const startOfDay = new Date(selectedDate)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(selectedDate)
      endOfDay.setHours(23, 59, 59, 999)

      setStartDate(startOfDay)
      setEndDate(endOfDay)
    } else {      
      setStartDate(selectedDate)
      setEndDate(new Date(selectedDate.getTime() + 60 * 60 * 1000))
    }
  }

  /**
   * Función para obtener el clima
   */
  const fetchWeather = async (suggestionCity: string) => {
    setIsFetching(true)
    setCity(suggestionCity)
    if (!suggestionCity || !startDate) return

    const dateTime = `${startDate.toISOString().slice(0, 10)} ${startDate.toTimeString().slice(0, 5)}`

    try {
      const response = await axios.get('/api/weather', {
        params: { location: suggestionCity, dateTime }
      })
      setWeather(response.data)

      const timezoneResponse = await axios.get('/api/timezone', {
        params: { location: suggestionCity }
      })

      const cityTimezone = timezoneResponse.data.timezone

      if (cityTimezone) {
        setTimezone(cityTimezone)
      }
    } catch (error) {
      console.error('Error fetching weather or timezone:', error)
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-background-dark p-6 rounded shadow-lg w-full max-w-md text-text-primary" aria-modal="true" role="dialog" aria-labelledby="event-form-title">
        <h2 id="event-form-title" className="text-xl font-bold mb-4 text-secondary">{eventToEdit ? 'Editar Evento' : 'Agregar Evento'}</h2>
        <form onSubmit={handleSubmit} aria-busy={isFetching}>
          <InformationSection title={title} setTitle={setTitle} description={description} setDescription={setDescription} />

          <ScheduleSection
            startDate={startDate}
            endDate={endDate}
            allDay={allDay}
            handleStartDateChange={handleStartDateChange}
            handleEndDateChange={handleEndDateChange}
            handleAllDayToggle={handleAllDayToggle}
            timezone={timezone} />

          <TimezoneSection timezone={timezone} setTimezone={setTimezone} citySelected={!!city} />

          <LocationSection fetchWeather={fetchWeather} city={city} />

          <WeatherSection weather={weather} />

          <ActionButtons eventToEdit={eventToEdit} handleDelete={handleDelete} setIsFormOpen={setIsFormOpen} isFetching={isFetching} />
        </form>
      </div>
    </div>
  )
}

export default EventForm

interface IInformationSectionProps {
  title: string
  setTitle: (title: string) => void
  description: string
  setDescription: (description: string) => void
}

/**
 * Sección de información del formulario
 * @param {string} title - Título del evento
 * @param {function} setTitle - Función para establecer el título
 * @param {string} description - Descripción del evento
 * @param {function} setDescription - Función para establecer la descripción
 */
const InformationSection = ({ title, setTitle, description, setDescription }: IInformationSectionProps) => {
  return (
    <>
      <div className="mb-3">
        <label htmlFor="title" className="block text-sm font-medium mb-1 text-text-secondary">
          Título
        </label>
        <input
          id="title"
          type="text"
          className="w-full bg-background-dark border border-border p-2 rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          aria-required="true"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="block text-sm font-medium mb-1 text-text-secondary">
          Descripción
        </label>
        <textarea
          id="description"
          className="w-full bg-background-dark border border-border p-2 rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-multiline="true"
        ></textarea>
      </div>
    </>
  )
}

interface IWeatherSectionProps {
  weather: { temperature: number; condition: string; icon: string } | null
}

/**
 * Sección de clima del formulario
 * @param {object} weather - Objeto con la información del clima
 */
const WeatherSection = ({ weather }: IWeatherSectionProps) => {
  if (!weather) return null
  return (
    <div className="flex mb-4 gap-2 justify-between items-center text-text-primary">
      <img src={weather.icon} alt={weather.condition} className="w-14 h-14" />
      <p className="text-sm">
        <span className="font-bold text-text-secondary">Clima:</span> {weather.condition}
      </p>
      <p className="text-sm">
        <span className="font-bold text-text-secondary">Temperatura:</span> {weather.temperature}°C
      </p>
    </div>
  )
}

interface IActionButtonsProps {
  eventToEdit: Event | null
  handleDelete: () => void
  setIsFormOpen: (isFormOpen: boolean) => void
  isFetching: boolean
}

/**
 * Sección de botones de acción del formulario
 * @param {object} eventToEdit - Objeto con la información del evento a editar
 * @param {function} handleDelete - Función para manejar la eliminación del evento
 * @param {function} setIsFormOpen - Función para establecer si el formulario está abierto
 * @param {boolean} isFetching - Indicador de carga
 */
const ActionButtons = ({ eventToEdit, handleDelete, setIsFormOpen, isFetching }: IActionButtonsProps) => {

  return (
    <div className="flex justify-end space-x-2 border-t border-border pt-4">
      {eventToEdit && (
        <BaseButton
          name="delete"
          type="button"
          variant="danger"
          className="px-4 py-2"
          onClick={handleDelete}
          isLoading={isFetching}
          aria-disabled={isFetching}
        >
          Eliminar
        </BaseButton>
      )}
      <BaseButton
        name="cancel"
        type="button"
        className="px-4 py-2"
        variant="secondary"
        onClick={() => setIsFormOpen(false)}
      >
        Cancelar
      </BaseButton>
      <BaseButton
        name="save"
        isLoading={isFetching}
        type="submit"
        className="px-4 py-2"
        aria-busy={isFetching}
      >
        Guardar
      </BaseButton>
    </div>
  )
}

interface ITimezoneSectionProps {
  timezone: string
  setTimezone: (tz: string) => void
  citySelected: boolean
}

const TimezoneSection = ({
  timezone,
  setTimezone,
  citySelected,
}: ITimezoneSectionProps) => {
  if (citySelected) {
    return (
      <div className="mb-4">
        <label
          htmlFor="timezone"
          className="block text-sm font-medium mb-1 text-secondary"
        >
          Zona Horaria
        </label>
        <input
          id="timezone"
          type="text"
          value={timezone}
          readOnly
          className="w-full bg-background-dark border border-border p-2 rounded text-text-primary focus:outline-none"
        />
      </div>
    )
  } else {
    return (
      <div className="mb-4">
        <label
          htmlFor="timezone"
          className="block text-sm font-medium mb-1 text-secondary"
        >
          Zona Horaria
        </label>
        <select
          id="timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full bg-background-dark border border-border p-2 rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {timeZonesNames.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>
    )
  }
}

