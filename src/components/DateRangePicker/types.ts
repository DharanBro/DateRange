export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DateMessage {
  date: Date;
  message: string;
  disabled?: boolean;
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  maxDays?: number;
  maxPastDays?: number;
  timezone?: string;
  dateMessages?: Array<{
    date: Date;
    message: string;
  }>;
  enableTimeSelection?: boolean;
} 