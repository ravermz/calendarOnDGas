import eventReducer, { initialState, EEventActions } from '@/context/reducer/eventReducer'
import { Event } from '@prisma/client'

describe('eventReducer', () => {
  it('handles FETCH_EVENTS_SUCCESS', () => {
    const mockEvents: Event[] = [
      { id: 1, title: 'Event 1', description: null, startDate: new Date(), endDate: new Date(), location: '', allDay: false, timezone: 'UTC', temperature: null, condition: null, icon: null },
      { id: 2, title: 'Event 2', description: null, startDate: new Date(), endDate: new Date(), location: '', allDay: false, timezone: 'UTC', temperature: null, condition: null, icon: null }
    ]

    const action = {
      type: EEventActions.FETCH_EVENTS_SUCCESS,
      events: mockEvents
    } as const

    const newState = eventReducer(initialState, action)

    expect(newState.loading).toBe(false)
    expect(newState.events).toEqual(mockEvents)
  })

  it('handles FETCH_EVENTS_FAILURE', () => {
    const action = {
      type: EEventActions.FETCH_EVENTS_FAILURE,
      error: 'Failed to load events'
    } as const

    const newState = eventReducer(initialState, action)

    expect(newState.loading).toBe(false)
    expect(newState.error).toBe('Failed to load events')
  })

  it('handles ADD_EVENT', () => {
    const newEvent: Event = { id: 3, title: 'New Event', description: null, startDate: new Date(), endDate: new Date(), location: '', allDay: false, timezone: 'UTC', temperature: null, condition: null, icon: null }

    const action = {
      type: EEventActions.ADD_EVENT,
      event: newEvent
    } as const

    const newState = eventReducer(initialState, action)

    expect(newState.events).toContain(newEvent)
    expect(newState.events.length).toBe(1)
  })

  it('handles UPDATE_EVENT', () => {
    const initialStateWithEvents = {
      ...initialState,
      events: [
        { id: 1, title: 'Event 1', description: null, startDate: new Date(), endDate: new Date(), location: '', allDay: false, timezone: 'UTC', temperature: null, condition: null, icon: null },
        { id: 2, title: 'Event 2', description: null, startDate: new Date(), endDate: new Date(), location: '', allDay: false, timezone: 'UTC', temperature: null, condition: null, icon: null }
      ]
    }

    const updatedEvent: Event = { id: 1, title: 'Updated Event 1', description: null, startDate: new Date(), endDate: new Date(), location: '', allDay: false, timezone: 'UTC', temperature: null, condition: null, icon: null }

    const action = {
      type: EEventActions.UPDATE_EVENT,
      event: updatedEvent
    } as const

    const newState = eventReducer(initialStateWithEvents, action)

    expect(newState.events.find(event => event.id === 1)).toEqual(updatedEvent)
    expect(newState.events.length).toBe(2)
  })

  it('handles DELETE_EVENT', () => {
    const initialStateWithEvents = {
      ...initialState,
      events: [
        { id: 1, title: 'Event 1', description: null, startDate: new Date(), endDate: new Date(), location: '', allDay: false, timezone: 'UTC', temperature: null, condition: null, icon: null },
        { id: 2, title: 'Event 2', description: null, startDate: new Date(), endDate: new Date(), location: '', allDay: false, timezone: 'UTC', temperature: null, condition: null, icon: null }
      ]
    }

    const action = {
      type: EEventActions.DELETE_EVENT,
      id: 1
    } as const

    const newState = eventReducer(initialStateWithEvents, action)

    expect(newState.events.some(event => event.id === 1)).toBe(false)
    expect(newState.events.length).toBe(1)
  })

  it('handles SET_EVENTS', () => {
    const newEvents: Event[] = [
      { id: 3, title: 'New Event 1', description: null, startDate: new Date(), endDate: new Date(), location: '', allDay: false, timezone: 'UTC', temperature: null, condition: null, icon: null },
      { id: 4, title: 'New Event 2', description: null, startDate: new Date(), endDate: new Date(), location: '', allDay: false, timezone: 'UTC', temperature: null, condition: null, icon: null }
    ]

    const action = {
      type: EEventActions.SET_EVENTS,
      events: newEvents
    } as const

    const newState = eventReducer(initialState, action)

    expect(newState.events).toEqual(newEvents)
  })

  it('handles SET_EVENT_TO_EDIT', () => {
    const eventToEdit: Event = { id: 1, title: 'Event to Edit', description: null, startDate: new Date(), endDate: new Date(), location: '', allDay: false, timezone: 'UTC', temperature: null, condition: null, icon: null }

    const action = {
      type: EEventActions.SET_EVENT_TO_EDIT,
      event: eventToEdit
    } as const

    const newState = eventReducer(initialState, action)

    expect(newState.eventToEdit).toEqual(eventToEdit)
  })

  it('handles UPDATE_EVENT_TIME', () => {
    const initialStateWithEvents = {
      ...initialState,
      events: [
        { id: 1, title: 'Event 1', startDate: new Date('2022-01-01T10:00:00Z'), endDate: new Date('2022-01-01T11:00:00Z'), location: '', allDay: false, timezone: 'UTC', temperature: null, condition: null, icon: null }
      ]
    }

    const updatedEvent: Event = { id: 1, title: 'Event 1', description: null, startDate: new Date('2022-01-01T12:00:00Z'), endDate: new Date('2022-01-01T13:00:00Z'), location: '', allDay: false, timezone: 'UTC', temperature: null, condition: null, icon: null }

    const action = {
      type: EEventActions.UPDATE_EVENT_TIME,
      event: updatedEvent
    } as const

    const newState = eventReducer({
      ...initialStateWithEvents,
      events: [{
        ...initialStateWithEvents.events[0],
        description: null
      }]
    }, action)

    const updatedEventInState = newState.events.find(event => event.id === 1)
    expect(updatedEventInState?.startDate).toEqual(updatedEvent.startDate)
    expect(updatedEventInState?.endDate).toEqual(updatedEvent.endDate)
  })

  it('handles SET_SELECTED_DATE', () => {
    const selectedDate = new Date('2022-01-01T00:00:00Z')

    const action = {
      type: EEventActions.SET_SELECTED_DATE,
      date: selectedDate,
      isFormOpen: true
    } as const

    const newState = eventReducer(initialState, action)

    expect(newState.selectedDate).toEqual(selectedDate)
    expect(newState.isFormOpen).toBe(true)
  })

  it('handles SET_IS_FORM_OPEN', () => {
    const action = {
      type: EEventActions.SET_IS_FORM_OPEN,
      isFormOpen: true
    } as const

    const newState = eventReducer(initialState, action)

    expect(newState.isFormOpen).toBe(true)

    const closeAction = {
      type: EEventActions.SET_IS_FORM_OPEN,
      isFormOpen: false
    } as const

    const closedState = eventReducer(newState, closeAction)

    expect(closedState.isFormOpen).toBe(false)
    expect(closedState.eventToEdit).toBe(null)
  })

  it('handles SET_NOTIFICATIONS', () => {
    const notifications = [
      { title: 'Success', message: 'Event added', type: 'success' as const, id: '1' },
      { title: 'Error', message: 'Failed to delete event', type: 'error' as const, id: '2' }
    ]

    const action = {
      type: EEventActions.SET_NOTIFICATIONS,
      notifications
    } as const

    const newState = eventReducer(initialState, action)

    expect(newState.notifications).toEqual(notifications)
  })

  it('handles ADD_NOTIFICATION', () => {
    const notification = { 
      title: 'Info', 
      message: 'Event updated', 
      type: 'success' as const 
    }

    const action = {
      type: EEventActions.ADD_NOTIFICATION,
      notification
    } as const

    const newState = eventReducer(initialState, action)

    expect(newState.notifications.length).toBe(1)
    expect(newState.notifications[0].title).toBe('Info')
    expect(newState.notifications[0].message).toBe('Event updated')
    expect(newState.notifications[0].type).toBe('success')
    expect(newState.notifications[0].id).toBeDefined()
  })

  it('handles SET_IS_FETCHING', () => {
    const action = {
      type: EEventActions.SET_IS_FETCHING,
      isFetching: true
    } as const

    const newState = eventReducer(initialState, action)

    expect(newState.isFetching).toBe(true)
  })
})
