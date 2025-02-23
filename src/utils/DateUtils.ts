import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isToday from "dayjs/plugin/isToday";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isToday);
/**
 * Core date utility functions that can be easily replaced with a date library in the future
 */
export const DateUtils = {
  /**
   * Calculate days difference between two dates
   */
  daysDifference(d1: Date, d2: Date): number {
    if (
      !(d1 instanceof Date) ||
      !(d2 instanceof Date) ||
      isNaN(d1.getTime()) ||
      isNaN(d2.getTime())
    ) {
      throw new Error("Invalid date(s) provided to daysDifference");
    }
    return dayjs(d1).diff(dayjs(d2), "day");
  },

  /**
   * Check if a date is before another date
   */
  isBefore(d1: Date, d2: Date): boolean {
    if (
      !(d1 instanceof Date) ||
      !(d2 instanceof Date) ||
      isNaN(d1.getTime()) ||
      isNaN(d2.getTime())
    ) {
      throw new Error("Invalid date(s) provided to isBefore");
    }
    return dayjs(d1).isBefore(dayjs(d2));
  },

  /**
   * Set specific time for a date
   */
  setTime(date: Date, hours: number, minutes: number): Date {
    const newDate = new Date(date);
    if (!(newDate instanceof Date) || isNaN(newDate.getTime())) {
      throw new Error("Invalid date provided to setTime");
    }
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  },

  /**
   * Format date for display using Intl.DateTimeFormat
   */
  formatDate(
    date: Date | null,
    includeTime = false,
    timezone?: string
  ): string {
    if (!date) return "";

    const newDate = new Date(date);
    if (!(newDate instanceof Date) || isNaN(newDate.getTime())) {
      return "";
    }

    try {
      if (includeTime) {
        return new Intl.DateTimeFormat("default", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: timezone,
        }).format(newDate);
      }
      return new Intl.DateTimeFormat("default", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: timezone,
      }).format(newDate);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  },

  /**
   * Check if a date is today
   */
  isToday(date: Date): boolean {
    const newDate = new Date(date);
    if (!(newDate instanceof Date) || isNaN(newDate.getTime())) {
      return false;
    }
    return dayjs(newDate).isToday();
  },

  /**
   * Parse time string (HH:mm) to hours and minutes
   */
  parseTimeString(timeStr: string): { hours: number; minutes: number } {
    try {
      const [hours, minutes] = timeStr.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) {
        throw new Error("Invalid time format");
      }
      return { hours, minutes };
    } catch (error) {
      console.error("Error parsing time string:", error);
      return { hours: 0, minutes: 0 };
    }
  },

  /**
   * Get time string in specified timezone
   */
  getTimeInTimezone(date: Date | null, timezone: string = "UTC"): string {
    if (!date) return "00:00";

    const newDate = new Date(date);
    if (!(newDate instanceof Date) || isNaN(newDate.getTime())) {
      return "00:00";
    }

    try {
      return new Intl.DateTimeFormat("default", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: timezone,
      }).format(newDate);
    } catch (error) {
      console.error("Error getting time in timezone:", error);
      return "00:00";
    }
  },

  /**
   * Set time for a date
   */
  setTimeInDate(date: Date, timeStr: string, timezone?: string): Date {
    return dayjs(date)
      .tz(timezone)
      .set("hour", parseInt(timeStr.split(":")[0]))
      .set("minute", parseInt(timeStr.split(":")[1]))
      .toDate();
  },

  /**
   * Get timezone offset
   * like GMT+00:00 DONT hardcode it
   */
  getTimezoneOffset(date: Date | null, timezone?: string): string {
    if (!date || !timezone) return "";

    return dayjs(date).tz(timezone).format("Z");
  },

  /**
   * Check if two dates are on the same day
   */
  isSameDay(date1: Date, date2: Date): boolean {
    return dayjs(date1).isSame(dayjs(date2), "day");
  },

  /**
   * Format date for API - YYYY-MM-DD HH:MM:SS+0000
   */
  formatForAPI(date: Date | null, timezone?: string): string {
    if (!date) return "";
    const format = "YYYY-MM-DD HH:mm:ssZZ";
    return dayjs(date).tz(timezone).format(format);
  },

  /**
   * Get the current date
   */
  getDate(
    date: Date = new Date(),
    {
      startOfDay = false,
      endOfDay = false,
    }: {
      startOfDay?: boolean;
      endOfDay?: boolean;
    } = {
      startOfDay: false,
      endOfDay: false,
    }
  ): Date {
    const dayJsDate = dayjs(date);
    if (startOfDay) {
      return dayJsDate.startOf("day").toDate();
    }
    if (endOfDay) {
      return dayJsDate.endOf("day").toDate();
    }
    return dayJsDate.toDate();
  },

  subtract(
    date: Date,
    unit: "day" | "week" | "month" | "year",
    count: number
  ): Date {
    return dayjs(date).subtract(count, unit).toDate();
  },

  setTimezone(date: Date, timezone: string): Date {
    return dayjs(date).tz(timezone).toDate();
  },

};
