import { render, screen } from '@testing-library/react'
import { format } from 'date-fns'
import MonthView from '@/components/Calendar/MonthView'
import { useEventContext } from '@/context/store/eventStore'
import { Event } from '@prisma/client'

jest.mock('../../context/store/eventStore')

const mockedUseEventContext = useEventContext as jest.MockedFunction<typeof useEventContext>

describe('MonthView Component', () => {
  beforeEach(() => {
    mockedUseEventContext.mockReturnValue({
      state: {
        events: [],
        selectedDate: new Date('2022-01-01T00:00:00Z'),
      }
    } as any)
  })

  it('renders days of the week correctly', () => {
    render(<MonthView />)
  
    const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    daysOfWeek.forEach(day => {
      expect(screen.getByText(new RegExp(`^${day}`, 'i'))).toBeInTheDocument()
    })
  })

  it('renders all days in the current month', () => {
    render(<MonthView />)

    const daysInMonth = screen.getAllByRole('gridcell')
    expect(daysInMonth.length).toBeGreaterThan(27)
  })

  it('displays events on the correct day', () => {
    const eventDate = new Date('2022-01-10T00:00:00Z')
    const mockEvent: Event = {
      id: 1, title: 'Test Event', startDate: eventDate, endDate: eventDate, location: '', allDay: false, timezone: 'UTC', temperature: null, condition: null, icon: null,
      description: null
    }
  
    mockedUseEventContext.mockReturnValue({
      state: {
        events: [mockEvent],
        selectedDate: new Date('2022-01-01T00:00:00Z')
      }
    } as any)
  
    render(<MonthView />)
  
    const dayCell = screen.getAllByRole('gridcell').find(cell => cell.textContent?.includes('10'))
    expect(dayCell).toBeInTheDocument()
  
    expect(dayCell).toHaveTextContent('10')
  })

  it('highlights today\'s date', () => {
    const today = new Date()
    mockedUseEventContext.mockReturnValue({
      state: {
        events: [],
        selectedDate: today
      }
    } as any)

    render(<MonthView />)

    const todayLabel = format(today, 'd')
    const todayElement = screen.getByText(todayLabel)

    expect(todayElement).toHaveAttribute('aria-current', 'date')
  })
})
