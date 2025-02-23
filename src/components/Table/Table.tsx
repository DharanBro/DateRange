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
import { cn } from "../../utils/cn";
import Loader from "../Loader/Loader";
import "./Table.css";

interface TableProps<T extends object> {
  readonly data: T[];
  readonly columns: ColumnDef<T, any>[];
  readonly enableMultiSort?: boolean;
  readonly containerClassName?: string;
  readonly rowHeight?: number;
  readonly tableHeight?: number;
  readonly onRowClick?: (row: T) => void;
  readonly loading?: boolean;
}

// Custom filter functions
const numericFilter: FilterFn<unknown> = (row, columnId, value) => {
  const cellValue = row.getValue(columnId);
  if (value === undefined || value === "") return true;
  if (cellValue == null) return false;

  return Number(cellValue) === Number(value);
};

const stringFilter: FilterFn<unknown> = (row, columnId, value) => {
  const cellValue = row.getValue(columnId);
  if (value === undefined || value === "") return true;
  if (cellValue == null) return false;

  return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
};

const NoRowsOverlay = () => (
  <div className="table-no-rows">
    <div className="table-no-rows-text">No results found</div>
  </div>
);

export function Table<T extends object>({
  data,
  columns,
  enableMultiSort = true,
  containerClassName = "",
  rowHeight = 45,
  tableHeight = 400,
  onRowClick,
  loading = false,
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});

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
  });

  const { rows } = table.getRowModel();

  const parentRef = React.useRef<HTMLDivElement>(null);

  const headerHeight = 100;
  const minTableHeight = 150; // Minimum height to show "No Results" message

  // Calculate actual content height (header + rows)
  const contentHeight =
    rows.length > 0
      ? rows.length * rowHeight + headerHeight
      : minTableHeight + headerHeight;

  const effectiveHeight = contentHeight > tableHeight ? "100%" : Math.min(tableHeight, contentHeight);


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
    if (!isSorted) return <ArrowUpDownIcon className="table-sort-icon" />;
    return isSorted === "asc" ? (
      <ArrowUpIcon className="table-sort-icon-active" />
    ) : (
      <ArrowDownIcon className="table-sort-icon-active" />
    );
  };

  const handleSort = (e: React.MouseEvent, column: Column<T>) => {
    const handler = column.getToggleSortingHandler();
    if (!handler) return;

    const isMultiSort = e.metaKey || e.ctrlKey;
    column.toggleSorting(undefined, isMultiSort);
  };

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={columns.length} className="table-loading-cell">
            <Loader />
          </td>
        </tr>
      );
    }

    if (rows.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length} className="table-loading-cell">
            <NoRowsOverlay />
          </td>
        </tr>
      );
    }

    return (
      <>
        {paddingTop > 0 && (
          <tr>
            <td style={{ height: `${paddingTop}px` }} />
          </tr>
        )}
        {virtualRows.map((virtualRow, rowIndex) => {
          const row = rows[virtualRow.index];
          const isLastRow = rowIndex === virtualRows.length - 1 && !paddingBottom;
          
          return (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row.original)}
              className={cn(
                "table-row",
                onRowClick && "table-row-clickable",
                isLastRow && "table-row-last"
              )}
            >
              {row.getVisibleCells().map((cell, index) => (
                <td
                  key={cell.id}
                  className={cn(
                    "table-cell",
                    index === 0 && "table-cell-first",
                    index === row.getVisibleCells().length - 1 && "table-cell-last"
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          );
        })}
        {paddingBottom > 0 && (
          <tr>
            <td style={{ height: `${paddingBottom}px` }} />
          </tr>
        )}
      </>
    );
  };

  return (
    <div className={cn("table-container", containerClassName)}>
      <div
        ref={parentRef}
        style={{ height: effectiveHeight }}
        className="table-scroll-container"
      >
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className={cn(
                      "table-header",
                      index === 0 && "table-header-first",
                      index === headerGroup.headers.length - 1 && "table-header-last"
                    )}
                  >
                    <div className="table-header-content">
                      <div
                        className={cn(
                          "table-header-sort",
                          header.column.getCanSort() && "table-header-sort-enabled"
                        )}
                        onClick={(e) =>
                          header.column.getCanSort() &&
                          handleSort(e, header.column)
                        }
                      >
                        <span className="table-header-text">
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
                          columnFilterValue={
                            header.column.getFilterValue() as string
                          }
                          setFilterValue={header.column.setFilterValue}
                        />
                      ) : (
                        <div className="table-filter-spacer" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="table-body">
            {renderTableBody()}
          </tbody>
        </table>
      </div>
    </div>
  );
}
