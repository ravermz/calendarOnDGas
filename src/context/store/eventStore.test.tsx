import '@testing-library/jest-dom'
import { render, screen, waitFor, act } from '@testing-library/react'
import axios from 'axios'
import EventState, { useEventContext } from '@/context/store/eventStore'
import { Event } from '@prisma/client'

jest.mock('axios')

const TestComponent = () => {
  const { addEvent, state } = useEventContext()
  const newEvent = {
    title: 'New Event',
    startDate: new Date(),
    endDate: new Date(),
    description: null,
    location: '',
    allDay: false,
    timezone: 'UTC',
    temperature: null,
    condition: null,
    icon: null
  }

  return (
    <div>
      <button onClick={() => addEvent(newEvent)}>Add Event</button>
      {state.events.map((event) => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  )
}

describe('Event Context', () => {
  it('adds a new event successfully', async () => {
    const mockEvent: Omit<Event, 'id'> = {
      title: 'Test Event',
      startDate: new Date(),
      endDate: new Date(),
      description: null,
      location: '',
      allDay: false,
      timezone: 'UTC',
      temperature: null,
      condition: null,
      icon: null
    }
    const mockResponse = { data: { id: 1, ...mockEvent } }
    jest.spyOn(axios, 'post').mockResolvedValueOnce(mockResponse)

    render(
      <EventState>
        <TestComponent />
      </EventState>
    )

    screen.getByText('Add Event').click()

    await screen.findByText('Test Event')
    expect(screen.getByText('Test Event')).toBeInTheDocument()
  })
})

const TestComponentEdit = () => {
  const { addEvent, updateEvent, state } = useEventContext()
  
  const existingEvent = {
    id: 1,
    title: 'Original Event',
    startDate: new Date(),
    endDate: new Date(),
    description: null,
    location: '',
    allDay: false,
    timezone: 'UTC',
    temperature: null,
    condition: null,
    icon: null,
  }

  const handleAddAndUpdate = async () => {
    await addEvent(existingEvent)
    updateEvent({ ...existingEvent, title: 'Updated Event' })
  }

  return (
    <div>
      <button onClick={handleAddAndUpdate}>Update Event</button>
      {state.events.map((event) => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  )
}

describe('Event Context', () => {
  it('updates an existing event successfully', async () => {
    const existingEvent: Event = {
      id: 1,
      title: 'Original Event',
      startDate: new Date(),
      endDate: new Date(),
      description: null,
      location: '',
      allDay: false,
      timezone: 'UTC',
      temperature: null,
      condition: null,
      icon: null,
    }
    const updatedEvent = { ...existingEvent, title: 'Updated Event' }
    jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: existingEvent })
    jest.spyOn(axios, 'put').mockResolvedValueOnce({ data: updatedEvent })

    render(
      <EventState>
        <TestComponentEdit />
      </EventState>
    )

    await act(async () => {
      screen.getByText('Update Event').click()
    })

    await waitFor(() => expect(screen.getByText('Updated Event')).toBeInTheDocument(), {
      timeout: 3000,
    })
  })
})

const TestComponentDelete = () => {
  const { deleteEvent, state } = useEventContext()
  const eventIdToDelete = 1

  return (
    <div>
      <button onClick={() => deleteEvent(eventIdToDelete)}>Delete Event</button>
      {state.events.map((event) => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  )
}

describe('Event Context', () => {
  it('deletes an event successfully', async () => {
    jest.spyOn(axios, 'delete').mockResolvedValueOnce({})

    render(
      <EventState>
        <TestComponentDelete />
      </EventState>
    )

    screen.getByText('Delete Event').click()

    expect(screen.queryByText('Event to Delete')).not.toBeInTheDocument()
  })
})
