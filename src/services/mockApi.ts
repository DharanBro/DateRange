import { DateUtils } from '../utils/dateUtils';

export interface TableData {
  id: number;
  name: string;
  email: string;
  status: string;
  date: string;
}

const mockData: TableData[] = Array.from({ length: 1000 }, (_, index) => {
  const today = new Date();
  const randomDate = new Date(today.setDate(today.getDate() - Math.floor(Math.random() * 90)));
  
  return {
    id: index + 1,
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
    date: randomDate.toISOString(),
  };
});

interface FetchDataParams {
  startDate: string;
  endDate: string;
  timezone: string;
}

export const fetchTableData = async ({
  startDate,
  endDate,
  timezone
}: FetchDataParams): Promise<TableData[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return mockData.filter(item => {
    const itemDate = DateUtils.formatForAPI(new Date(item.date), timezone);
    return itemDate >= startDate && itemDate <= endDate;
  });
}; 