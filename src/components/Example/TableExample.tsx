import React from 'react'
import { Table } from '../Table/Table'
import { createColumnHelper } from '@tanstack/react-table'

interface Person {
  id: number
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
}

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: info => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    cell: info => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    cell: info => info.getValue(),
    meta: { type: 'number' },
    enableSorting: true,
    enableColumnFilter: false,
  }),
  columnHelper.accessor('visits', {
    header: 'Visits',
    cell: info => info.getValue(),
    meta: { type: 'number' },
    enableSorting: true,
    enableColumnFilter: true,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => info.getValue(),
    enableSorting: false,
    enableColumnFilter: true,
  }),
]

// Add more varied sample data
const data: Person[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    visits: 10,
    status: 'Active',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    age: 25,
    visits: 15,
    status: 'Inactive',
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    age: 30, // Same age as John
    visits: 20,
    status: 'Active',
  },
  {
    id: 4,
    firstName: 'Alice',
    lastName: 'Williams',
    age: 28,
    visits: 8,
    status: 'Pending',
  },
  {
    id: 5,
    firstName: 'Charlie',
    lastName: 'Brown',
    age: 30, // Same age as John and Bob
    visits: 12,
    status: 'Active',
  },
]

export const TableExample: React.FC = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <Table
        data={data}
        columns={columns}
        enableMultiSort
        tableHeight={500}
        onRowClick={(row) => console.log('Clicked row:', row)}
      />
    </div>
  )
} 