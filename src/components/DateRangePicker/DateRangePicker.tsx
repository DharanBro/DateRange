import React, { useState, useRef } from 'react';
import { DateRange, DateRangePickerProps } from './types';
import { Calendar } from './Calendar';
import { TimeSelection } from './TimeSelection';
import { DateTimeUtils } from '../../utils/DateTimeUtils';
import { DateRangePickerUtils } from './dateRangeUtils';
import './DateRangePicker.css';

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  maxDays = 10,
  maxPastDays = 90,
  timezone = 'UTC',
  dateMessages = [],
  enableTimeSelection = false,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showTimeSelection, setShowTimeSelection] = useState(enableTimeSelection);
  const calendarRef = useRef<HTMLDivElement>(null);

  const formatDisplayDate = (dateStr: string | null): string => {
    return DateRangePickerUtils.formatDisplayDate(dateStr, timezone, enableTimeSelection);
  };

  const handleDateClick = (date: Date) => {
    if (DateRangePickerUtils.isDateDisabled(date, maxPastDays, dateMessages)) return;

    let newRange: DateRange = { ...value };
    const defaultStartTime = '00:00:00';
    const defaultEndTime = '23:59:59';

    if (!value.startDate || (value.startDate && value.endDate)) {
      newRange = {
        startDate: DateTimeUtils.setTimeInTimezone(date, defaultStartTime, timezone),
        endDate: null
      };
    } else {
      const startDate = new Date(value.startDate);
      if (date < startDate) {
        newRange.startDate = DateTimeUtils.setTimeInTimezone(date, defaultStartTime, timezone);
        const existingTime = DateTimeUtils.getTimeInTimezone(value.startDate, timezone);
        newRange.endDate = DateTimeUtils.setTimeInTimezone(startDate, existingTime || defaultEndTime, timezone);
      } else {
        const daysDiff = DateTimeUtils.daysDifference(date, startDate);
        if (daysDiff > maxDays) return;
        newRange.endDate = DateTimeUtils.setTimeInTimezone(date, defaultEndTime, timezone);
      }
    }

    onChange(newRange);
    if (newRange.endDate) {
      setIsCalendarOpen(false);
    }
  };

  const handleTimeChange = (type: 'start' | 'end', timeStr: string) => {
    if (!value.startDate || !value.endDate) return;

    const newRange = { ...value };
    if (type === 'start') {
      newRange.startDate = DateTimeUtils.setTimeInTimezone(
        new Date(value.startDate),
        timeStr,
        timezone
      );
    } else {
      newRange.endDate = DateTimeUtils.setTimeInTimezone(
        new Date(value.endDate),
        timeStr,
        timezone
      );
    }

    onChange(newRange);
  };

  // Close calendar when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="date-range-picker-container" ref={calendarRef}>
      <div
        className="date-range-input"
        onClick={() => setIsCalendarOpen(true)}
      >
        <input
          type="text"
          readOnly
          placeholder="Select date range"
          value={value.startDate || value.endDate ? 
            `${formatDisplayDate(value.startDate)} - ${formatDisplayDate(value.endDate)}` :
            ''}
          className="date-input"
        />
      </div>

      {isCalendarOpen && (
        <div className="calendar-popup">
          <div className="date-range-picker">
            <Calendar
              currentMonth={currentMonth}
              value={value}
              maxDays={maxDays}
              timezone={timezone}
              onDateClick={handleDateClick}
              onMonthChange={setCurrentMonth}
              isDateDisabled={(date) => DateRangePickerUtils.isDateDisabled(date, maxPastDays, dateMessages)}
              getDateMessage={(date) => DateRangePickerUtils.getDateMessage(date, dateMessages)}
              hoveredDate={hoveredDate}
              onDateHover={setHoveredDate}
              onDateLeave={() => setHoveredDate(null)}
            />

            <div className="selected-range">
              {value.startDate && (
                <div className="mb-1">
                  Start: {formatDisplayDate(value.startDate)}
                </div>
              )}
              {value.endDate && (
                <div>
                  End: {formatDisplayDate(value.endDate)}
                </div>
              )}
            </div>

            {enableTimeSelection && (
              <TimeSelection
                value={value}
                timezone={timezone}
                showTimeSelection={showTimeSelection}
                onTimeSelectionToggle={setShowTimeSelection}
                onTimeChange={handleTimeChange}
                getTimeFromISO={(date) => DateTimeUtils.getTimeInTimezone(date, timezone)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 