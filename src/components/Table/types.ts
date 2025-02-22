import { Column } from '@tanstack/react-table'

export interface FilterProps {
  readonly column: Column<unknown>
  readonly columnFilterValue: string | number | undefined
  readonly setFilterValue: (value: string | number | undefined) => void
}

declare module '@tanstack/table-core' {
  interface ColumnMeta {
    type?: 'number' | 'string'
  }
} 