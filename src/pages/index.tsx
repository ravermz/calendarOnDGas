import { useEffect } from 'react'
import type { NextPage } from 'next'
import axios from 'axios'
import { Event } from '@prisma/client'

import { useEventContext } from '@/context/store/eventStore'
import { EEventActions } from '@/context/reducer/eventReducer'

import Calendar from '@/components/Calendar/Calendar'

const Home: NextPage = () => {
  const { dispatch } = useEventContext()

  useEffect(() => {
    const fetchEvents = async (): Promise<void> => {
      try {
        const response = await axios.get<Event[]>('/api/events');
        dispatch({ type: EEventActions.FETCH_EVENTS_SUCCESS, events: response.data })
      } catch (err) {
        console.error('Error fetching events:', err);
        dispatch({ type: EEventActions.FETCH_EVENTS_FAILURE, error: 'Error al cargar los eventos' })
      }
    }

    fetchEvents()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <Calendar />
    </div>
  )
}

export default Home
