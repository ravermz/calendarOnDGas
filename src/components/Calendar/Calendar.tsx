import React, { useState } from 'react'

import MonthView from './MonthView'
import WeekView from './WeekView'
import DayView from './DayView'

const Calendar: React.FC = () => {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  const renderView = () => {
    switch (view) {
      case 'month':
        return <MonthView />
      case 'week':
        return <WeekView />
      case 'day':
        return <DayView />
      default:
        return <MonthView />
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Calendario</h1>
        <div>
          <button onClick={() => setView('month')}>Mes</button>
          <button onClick={() => setView('week')}>Semana</button>
          <button onClick={() => setView('day')}>Día</button>
        </div>
      </div>
      {renderView()}
    </div>
  )
}

export default Calendar
