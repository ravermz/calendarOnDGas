import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react'
import EventForm from '@/components/Event/EventForm'
import { Event } from '@prisma/client'
import axios from 'axios'
import { useEventContext } from '@/context/store/eventStore'

jest.mock('axios')
jest.mock('../../context/store/eventStore')

const mockedAxios = axios as jest.Mocked<typeof axios>
const mockedUseEventContext = useEventContext as jest.MockedFunction<typeof useEventContext>

const mockEvent: Event = {
  id: 1,
  title: 'Event to Edit',
  description: 'Description of event',
  startDate: new Date(),
  endDate: new Date(),
  allDay: false,
  location: 'City',
  timezone: 'UTC',
  temperature: 20,
  condition: 'Sunny',
  icon: 'sunny-icon.png'
}

afterEach(async () => {
  jest.clearAllMocks()
  await cleanup()
})

describe('EventForm Component - Create Event', () => {
  it('creates a new event', async () => {
    const mockAddEvent = jest.fn()
    mockedUseEventContext.mockReturnValue({
      addEvent: mockAddEvent,
      setIsFormOpen: jest.fn(),
      state: { eventToEdit: null, selectedDate: new Date(), isFetching: false }
    } as any)

    render(<EventForm />)

    fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'New Event' } })
    fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Description' } })

    mockedAxios.post.mockResolvedValueOnce({ data: { id: 1, title: 'New Event' } })

    fireEvent.click(screen.getByRole('button', { name: /guardar/i }))

    await waitFor(() =>
      expect(mockAddEvent).toHaveBeenCalledWith(expect.objectContaining({ title: 'New Event', description: 'Description' }))
    )
  })
})

describe('EventForm Component - Edit Event', () => {
  it('edits an existing event', async () => {
    const mockUpdateEvent = jest.fn()
    mockedUseEventContext.mockReturnValue({
      updateEvent: mockUpdateEvent,
      setIsFormOpen: jest.fn(),
      state: { eventToEdit: mockEvent, selectedDate: new Date(), isFetching: false }
    } as any)

    render(<EventForm />)

    fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'Updated Event' } })
    fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Updated Description' } })

    mockedAxios.put.mockResolvedValueOnce({ data: { ...mockEvent, title: 'Updated Event', description: 'Updated Description' } })

    fireEvent.click(screen.getByRole('button', { name: /guardar/i }))

    await waitFor(() =>
      expect(mockUpdateEvent).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated Event', description: 'Updated Description' }))
    )
  })
})

describe('EventForm Component - Delete Event', () => {
  it('deletes an event', async () => {
    const mockDeleteEvent = jest.fn()
    mockedUseEventContext.mockReturnValue({
      deleteEvent: mockDeleteEvent,
      setIsFormOpen: jest.fn(),
      state: { eventToEdit: mockEvent, selectedDate: new Date(), isFetching: false }
    } as any)

    render(<EventForm />)

    mockedAxios.delete.mockResolvedValueOnce({})

    fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))

    await waitFor(() =>
      expect(mockDeleteEvent).toHaveBeenCalledWith(mockEvent.id)
    )
  })
})
