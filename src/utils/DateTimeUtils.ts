export class DateTimeUtils {
  static formatDate(date: Date | string | null, options: Intl.DateTimeFormatOptions & { timezone?: string }): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat('en-US', {
      ...options,
      timeZone: options.timezone ?? 'UTC'
    }).format(dateObj);
  }

  static getTimeInTimezone(date: Date | string | null, timezone: string): string {
    if (!date) return '00:00';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone 
    });
  }

  static setTimeInTimezone(date: Date, time: string, timezone: string): string {
    const [hours, minutes, seconds = '0'] = time.split(':');
    
    // Create date in specified timezone
    const timezonedDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    timezonedDate.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds), 0);

    // Convert to UTC ISO string
    const utcDate = new Date(timezonedDate.toLocaleString('en-US', { timeZone: timezone }));
    return utcDate.toISOString();
  }

  static isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  static getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  static getStartOfMonth(year: number, month: number): Date {
    return new Date(year, month, 1);
  }

  static getEndOfMonth(year: number, month: number): Date {
    return new Date(year, month + 1, 0);
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static daysDifference(date1: Date, date2: Date): number {
    return Math.ceil(Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
  }

  static parseISODate(dateStr: string): Date {
    return new Date(dateStr);
  }

  static toISOString(date: Date): string {
    return date.toISOString();
  }
} 