import React, { useEffect, useState, useCallback } from 'react';
import { Table } from './components/Table/Table';
import { fetchTableData, TableData } from './services/mockApi';
import { DateTimeUtils } from './utils/DateTimeUtils';
import { DateRangePicker } from './components/DateRangePicker/DateRangePicker';
import { DateRange, DateMessage } from './components/DateRangePicker/types';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<TableData>();

const App: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: DateTimeUtils.toISOString(DateTimeUtils.subtractDays(new Date(), 7)),
    endDate: DateTimeUtils.toISOString(new Date()),
  });
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);

  // Demo date messages
  const dateMessages: DateMessage[] = [
    {
      date: '2025-02-14',
      message: "Valentine's Day - High traffic expected"
    },
    {
      date: '2025-02-28',  // Note: 2025 is not a leap year
      message: "Month-end maintenance"
    },
    {
      date: '2025-03-17',
      message: "St. Patrick's Day - Limited availability"
    },
    // Disable specific dates
    {
      date: '2025-02-15',
      message: "System maintenance",
      disabled: true
    },
    // Disable a range of dates
    ...Array.from({ length: 5 }).map((_, index) => ({
      date: DateTimeUtils.formatDateToYYYYMMDD(new Date(2025, 2, 10 + index), Intl.DateTimeFormat().resolvedOptions().timeZone), // March 10-14
      message: "System upgrade period",
      disabled: true
    }))
  ];

  console.log('dateMessages', dateMessages);

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: info => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue(),
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => info.getValue(),
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => info.getValue(),
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: info => DateTimeUtils.formatDate(info.getValue(), {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }),
      enableSorting: true,
      enableColumnFilter: false,
    }),
  ];

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const data = await fetchTableData({
        startDate: dateRange.startDate ?? '',
        endDate: dateRange.endDate ?? '',
        timezone,
      });
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <div className="mb-4 flex gap-4 items-center">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          maxDays={90}
          maxPastDays={90}
          timezone={Intl.DateTimeFormat().resolvedOptions().timeZone}
          dateMessages={dateMessages}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <Table
          data={data}
          columns={columns}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default App;
