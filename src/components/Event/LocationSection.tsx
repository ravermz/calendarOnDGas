import { useState, useEffect } from 'react'
import axios, { CancelTokenSource } from 'axios'

import { useEventContext } from '@/context/store/eventStore'

interface ILocationSectionProps {
  fetchWeather: (city: string) => void
  city?: string
}

/**
 * Sección de ubicación del formulario 🇲🇽
 * @param {function} fetchWeather - Función para obtener el clima
 * @param {string} city - Ciudad del evento
 */
const LocationSection = ({ fetchWeather, city }: ILocationSectionProps) => {
  const { setIsFetching, addNotification } = useEventContext()

  const [query, setQuery] = useState(city || '')
  const [suggestions, setSuggestions] = useState<{ name: string; region: string; country: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [shouldFetch, setShouldFetch] = useState(false)

  useEffect(() => {
    if (city) {
      setQuery(city)
      setShouldFetch(false)
    }
  }, [city])

  useEffect(() => {
    let cancelToken: CancelTokenSource | undefined

    const fetchCities = async () => {
      if (query.length < 3 || !shouldFetch) {
        setSuggestions([])
        return
      }

      setLoading(true)
      setIsFetching(true)
      if (cancelToken) {
        cancelToken.cancel()
      }

      cancelToken = axios.CancelToken.source()

      try {
        const response = await axios.get(`/api/searchCity`, {
          params: { query },
          cancelToken: cancelToken.token,
        })
        setSuggestions(response.data)
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Previous request canceled', error.message)
        } else {
          console.error('Error fetching city suggestions:', error)
          addNotification({
            title: 'Error',
            message: 'Error al obtener las sugerencias de la ciudad',
            type: 'error',
          })
        }
      } finally {
        setLoading(false)
        setIsFetching(false)
      }
    }

    fetchCities()

    return () => {
      if (cancelToken) {
        cancelToken.cancel()
      }
    }
  }, [query, shouldFetch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setShouldFetch(true)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setSuggestions([])
    setShouldFetch(false)
    fetchWeather(suggestion)
  }

  return (
    <div className="mb-4">
      <label htmlFor="city-input" className="block text-sm font-medium mb-1 text-text-secondary">
        Ubicación (Ciudad)
      </label>
      <div className="flex items-center relative">
        <input
          id="city-input"
          type="text"
          className="w-full bg-background-dark border border-border p-2 rounded text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          value={query}
          onChange={handleInputChange}
          placeholder="Ingresa la ciudad o usa tu ubicación"
          aria-autocomplete="list"
          aria-controls="city-suggestions"
          aria-expanded={suggestions.length > 0}
        />
        {loading && (
          <span
            className="absolute top-full mt-1 text-sm text-text-secondary"
            role="status"
            aria-live="polite"
          >
            Buscando...
          </span>
        )}

        {suggestions.length > 0 && (
          <ul
            id="city-suggestions"
            className="absolute top-full mt-1 bg-background-dark border border-border w-full rounded shadow-lg z-10"
            role="listbox"
            aria-live="polite"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={`${suggestion.name}-${index}`}
                onClick={() => handleSuggestionClick(suggestion.name)}
                className="px-4 py-2 cursor-pointer hover:bg-background"
                role="option"
              >
                {suggestion.name}, {suggestion.region}, {suggestion.country}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default LocationSection
