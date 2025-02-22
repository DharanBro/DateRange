import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  Column,
  ColumnDef,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from "lucide-react";
import { ColumnFilter } from "./ColumnFilter";
import { cn } from "../../utils/cn"

interface TableProps<T extends object> {
  readonly data: T[]
  readonly columns: ColumnDef<T>[]
  readonly enableMultiSort?: boolean
  readonly containerClassName?: string
  readonly rowHeight?: number
  readonly tableHeight?: number
  readonly onRowClick?: (row: T) => void
}

// Custom filter functions
const numericFilter: FilterFn<unknown> = (row, columnId, value) => {
  const cellValue = row.getValue(columnId)
  if (value === undefined || value === "") return true
  if (cellValue == null) return false
  
  return Number(cellValue) === Number(value)
}

const stringFilter: FilterFn<unknown> = (row, columnId, value) => {
  const cellValue = row.getValue(columnId)
  if (value === undefined || value === "") return true
  if (cellValue == null) return false
  
  return String(cellValue)
    .toLowerCase()
    .includes(String(value).toLowerCase())
}

const NoRowsOverlay = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-white/50">
    <div className="text-sm text-gray-500">No results found</div>
  </div>
)

export function Table<T extends object>({
  data,
  columns,
  enableMultiSort = true,
  containerClassName = "",
  rowHeight = 45,
  tableHeight = 400,
  onRowClick,
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState({})

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    filterFns: {
      numeric: numericFilter,
      string: stringFilter,
    },
    enableSorting: true,
    enableMultiSort,
    enableColumnFilters: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const { rows } = table.getRowModel();

  const parentRef = React.useRef<HTMLDivElement>(null);

  const headerHeight = 100
  const minTableHeight = 150 // Minimum height to show "No Results" message
  
  // Calculate actual content height (header + rows)
  const contentHeight = rows.length > 0 
    ? (rows.length * rowHeight) + headerHeight
    : minTableHeight + headerHeight

  const effectiveHeight = Math.min(tableHeight, contentHeight)

  console.log({effectiveHeight, contentHeight, rows, rowHeight})

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 10,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  const getSortingIcon = (isSorted: false | string) => {
    if (!isSorted) return <ArrowUpDownIcon className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    return isSorted === "asc" ? (
      <ArrowUpIcon className="w-3.5 h-3.5 text-gray-700" />
    ) : (
      <ArrowDownIcon className="w-3.5 h-3.5 text-gray-700" />
    )
  }

  const handleSort = (e: React.MouseEvent, column: Column<T>) => {
    const handler = column.getToggleSortingHandler()
    if (!handler) return
    
    const isMultiSort = e.metaKey || e.ctrlKey
    column.toggleSorting(undefined, isMultiSort)
  }

  return (
    <div className={cn("rounded-md border border-gray-200 bg-white", containerClassName)}>
      <div
        ref={parentRef}
        style={{ height: effectiveHeight }}
        className="relative overflow-auto"
      >
        <table className="w-full border-collapse table-auto border-gray-200">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="sticky top-0 z-10 bg-gray-100 border-r border-gray-200 last:border-r-0 text-left"
                  >
                    <div className="px-4 py-3">
                      <div
                        className={cn(
                          "flex items-center gap-2 h-8 group",
                          header.column.getCanSort() && "cursor-pointer hover:text-gray-900"
                        )}
                        onClick={(e) =>
                          header.column.getCanSort() && handleSort(e, header.column)
                        }
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {header.column.getCanSort() &&
                          getSortingIcon(header.column.getIsSorted())}
                      </div>
                      {header.column.getCanFilter() ? (
                        <ColumnFilter
                          column={header.column}
                          columnFilterValue={header.column.getFilterValue() as string}
                          setFilterValue={header.column.setFilterValue}
                        />
                      ) : (
                        <div className="h-8" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.length > 0 ? (
              <>
                {paddingTop > 0 && (
                  <tr>
                    <td style={{ height: `${paddingTop}px` }} />
                  </tr>
                )}
                {virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index]
                  return (
                    <tr
                      key={row.id}
                      onClick={() => onRowClick?.(row.original)}
                      className={cn(
                        "hover:bg-gray-50/50 transition-colors",
                        onRowClick && "cursor-pointer"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-3 border-r border-gray-200 last:border-r-0 text-sm text-gray-600"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  )
                })}
                {paddingBottom > 0 && (
                  <tr>
                    <td style={{ height: `${paddingBottom}px` }} />
                  </tr>
                )}
              </>
            ) : (
              <tr>
                <td 
                  colSpan={columns.length}
                  className="relative h-[150px]" // Match minTableHeight
                >
                  <NoRowsOverlay />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
