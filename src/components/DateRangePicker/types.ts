export interface DateRange {
  startDate: string | null; // ISO datetime string
  endDate: string | null; // ISO datetime string
}

export interface DateMessage {
  date: string; // ISO date string
  message: string;
  disabled: boolean;
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  maxDays?: number;
  maxPastDays?: number;
  timezone?: string;
  dateMessages?: DateMessage[];
  enableTimeSelection?: boolean;
} 