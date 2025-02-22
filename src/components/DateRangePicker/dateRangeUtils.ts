import { DateTimeUtils } from '../../utils/DateTimeUtils';
import { DateMessage, DateRange } from './types';

export class DateRangePickerUtils {
  static formatDisplayDate(dateStr: string | null, timezone: string, showTime: boolean = false): string {
    return DateTimeUtils.formatDate(dateStr, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...(showTime && {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }),
      timezone
    });
  }

  static isDateDisabled(date: Date, maxPastDays: number, dateMessages: DateMessage[]): boolean {
    const pastLimit = DateTimeUtils.addDays(new Date(), -maxPastDays);
    if (date < pastLimit) return true;

    const dateStr = DateTimeUtils.toISOString(date).split('T')[0];
    const messageObj = dateMessages.find(msg => msg.date === dateStr);
    return messageObj?.disabled || false;
  }

  static getDateMessage(date: Date, dateMessages: DateMessage[]): string | null {
    const dateStr = DateTimeUtils.toISOString(date).split('T')[0];
    const messageObj = dateMessages.find(msg => msg.date === dateStr);
    return messageObj?.message ?? null;
  }

  static getDaysInMonth(date: Date): (Date | null)[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = DateTimeUtils.getStartOfMonth(year, month);
    const daysInMonth = DateTimeUtils.getDaysInMonth(year, month);
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = Array(startingDayOfWeek).fill(null);
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }

  static isDateInRange(date: Date, range: DateRange): boolean {
    if (!range.startDate || !range.endDate) return false;
    const start = new Date(range.startDate);
    const end = new Date(range.endDate);
    return date >= start && date <= end;
  }
} 