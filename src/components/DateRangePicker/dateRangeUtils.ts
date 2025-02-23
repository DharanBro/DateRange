import { DateUtils } from '../../utils/dateUtils';
import { DateMessage, DateRange } from './types';

export class DateRangePickerUtils {

  static isDateDisabled(date: Date, maxPastDays: number, dateMessages: DateMessage[]): boolean {
    const today = new Date();
    const pastLimit = new Date(today.setDate(today.getDate() - maxPastDays));
    if (date < pastLimit) return true;
    
    const messageObj = dateMessages.find(msg => 
      DateUtils.isSameDay(msg.date, date)
    );
    return messageObj?.disabled || false;
  }

  static getDateMessage(date: Date, dateMessages: DateMessage[]): string | null {
    const messageObj = dateMessages.find(msg => 
      DateUtils.isSameDay(msg.date, date)
    );
    return messageObj?.message ?? null;
  }

  static getDaysInMonth(date: Date): (Date | null)[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = Array(startingDayOfWeek).fill(null);
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }

  static isDateInRange(date: Date, range: DateRange): boolean {
    if (!range.startDate || !range.endDate) return false;
    return date >= range.startDate && date <= range.endDate;
  }
} 