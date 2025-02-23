import React, { useEffect, useState, useCallback } from "react";
import { Table } from "./components/Table/Table";
import { fetchTableData, TableData } from "./services/mockApi";
import { DateUtils } from "./utils/dateUtils";
import { DateRangePicker } from "./components/DateRangePicker/DateRangePicker";
import { DateRange, DateMessage } from "./components/DateRangePicker/types";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<TableData>();

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Asia/Tokyo",
  "Asia/Calcutta",
  "Australia/Sydney",
];

const App: React.FC = () => {
  const today = DateUtils.getDate();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: DateUtils.getDate(DateUtils.subtract(today, "day", 7), {
      startOfDay: true,
    }),
    endDate: DateUtils.getDate(today, { endOfDay: true }),
  });
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Demo date messages
  const dateMessages: DateMessage[] = [
    {
      date: new Date(2025, 1, 14), // Feb 14, 2025
      message: "Valentine's Day - High traffic expected",
    },
    {
      date: new Date(2025, 1, 28), // Feb 28, 2025
      message: "Month-end maintenance",
    },
    {
      date: new Date(2025, 2, 17), // March 17, 2025
      message: "St. Patrick's Day - Limited availability",
    },
    // Disable specific dates
    {
      date: new Date(2025, 1, 15), // Feb 15, 2025
      message: "System maintenance",
      disabled: true,
    },
    // Disable a range of dates
    ...Array.from({ length: 5 }).map((_, index) => ({
      date: new Date(2025, 2, 10 + index), // March 10-14
      message: "System upgrade period",
      disabled: true,
    })),
  ];

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => {
        const date = new Date(info.getValue());
        return DateUtils.formatDate(date, true, selectedTimezone);
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),
  ];

  const loadData = useCallback(async () => {
    setLoading(true);
    const params = {
      startDate: DateUtils.formatForAPI(dateRange.startDate, selectedTimezone),
      endDate: DateUtils.formatForAPI(dateRange.endDate, selectedTimezone),
      timezone: selectedTimezone,
    };
    try {
      const data = await fetchTableData(params);
      console.log("params", params);
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [dateRange, selectedTimezone]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setDateRange((prev) => {
      const updatedDateRange = { ...prev };
      if (prev.startDate) {
        updatedDateRange.startDate = DateUtils.setTimezone(
          prev.startDate,
          selectedTimezone
        );
    }
      if (prev.endDate) {
        updatedDateRange.endDate = DateUtils.setTimezone(
          prev.endDate,
          selectedTimezone
        );
      }
      return updatedDateRange;
    });
  }, [selectedTimezone]);

  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <div className="mb-4 flex gap-4 items-center">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          maxDays={10}
          maxPastDays={90}
          timezone={selectedTimezone}
          dateMessages={dateMessages}
          enableTimeSelection={true}
        />
        <select
          className="p-2 border rounded-md"
          value={selectedTimezone}
          onChange={(e) => setSelectedTimezone(e.target.value)}
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 overflow-hidden">
        <Table data={data} columns={columns} loading={loading} />
      </div>
    </div>
  );
};

export default App;
