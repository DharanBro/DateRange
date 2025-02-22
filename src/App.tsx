import React, { useState } from 'react'
import { DateRangePicker } from './components/DateRangePicker/DateRangePicker'
import { DateRange, DateMessage } from './components/DateRangePicker/types'

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
    <div>
      <h1>Date Range Picker Demo</h1>
      <DateRangePicker
        value={dateRange}
        onChange={setDateRange}
        maxDays={7}
        maxPastDays={90}
        timezone="Asia/Calcutta"
        dateMessages={dateMessages}
        enableTimeSelection={true}
      />
      <pre>{JSON.stringify(dateRange, null, 2)}</pre>
    </div>
  )
}

export default App
