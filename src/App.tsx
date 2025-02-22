import React, { useState } from 'react'
import { DateRangePicker } from './components/DateRangePicker/DateRangePicker'
import { DateRange, DateMessage } from './components/DateRangePicker/types'
import { TableExample } from './components/Example/TableExample'

const App: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null
  })

  const dateMessages: DateMessage[] = [
    {
      date: '2025-03-20',
      message: 'Holiday',
      disabled: true
    },
    {
      date: '2025-03-25',
      message: 'Special day',
      disabled: false
    },
    {
      date: '2025-03-26',
      message: 'Random day',
      disabled: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Table Component Demo</h1>
        <TableExample />
      </div>
    </div>
  )
}

export default App
