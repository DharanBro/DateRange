import { DateTimeUtils } from '../utils/DateTimeUtils';

export interface TableData {
  id: number;
  name: string;
  email: string;
  status: string;
  date: string;
}

const mockData: TableData[] = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
  date: DateTimeUtils.formatWithTimezone(
    DateTimeUtils.subtractDays(
      new Date(),
      Math.floor(Math.random() * 90)
    ),
    Intl.DateTimeFormat().resolvedOptions().timeZone
  ),
}));

interface FetchDataParams {
  startDate: string;
  endDate: string;
  timezone: string;
}

export const fetchTableData = async ({
  startDate,
  endDate,
}: FetchDataParams): Promise<TableData[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return mockData.filter(item => {
    const itemDate = new Date(item.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return itemDate >= start && itemDate <= end;
  });
}; 