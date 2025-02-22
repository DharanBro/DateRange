import React, { useState, useRef, useEffect } from 'react';
import { DateRange, DateRangePickerProps } from './types';
import { Calendar } from './Calendar';
import { TimeSelection } from './TimeSelection';
import { DateTimeUtils } from '../../utils/DateTimeUtils';
import { DateRangePickerUtils } from './dateRangeUtils';
import { Button } from '../Button/Button';
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
  const [internalValue, setInternalValue] = useState<DateRange>(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const formatDisplayDate = (dateStr: string | null): string => {
    return DateRangePickerUtils.formatDisplayDate(dateStr, timezone, enableTimeSelection);
  };

  const handleDateClick = (date: Date) => {
    if (DateRangePickerUtils.isDateDisabled(date, maxPastDays, dateMessages)) return;

    let newRange: DateRange = { ...internalValue };
    const defaultStartTime = '00:00:00';
    const defaultEndTime = '23:59:59';

    if (!internalValue.startDate || (internalValue.startDate && internalValue.endDate)) {
      newRange = {
        startDate: DateTimeUtils.updateDateWithTimeInTimezone(date, defaultStartTime, timezone),
        endDate: null
      };
      setInternalValue(newRange);
    } else {
      const startDate = new Date(internalValue.startDate);
      if (date < startDate) {
        newRange.startDate = DateTimeUtils.updateDateWithTimeInTimezone(date, defaultStartTime, timezone);
        const existingTime = DateTimeUtils.retrieveTimeInTimezone(internalValue.startDate, timezone);
        newRange.endDate = DateTimeUtils.updateDateWithTimeInTimezone(startDate, existingTime || defaultEndTime, timezone);
      } else {
        const daysDiff = DateTimeUtils.daysDifference(date, startDate);
        if (daysDiff > maxDays) return;
        newRange.endDate = DateTimeUtils.updateDateWithTimeInTimezone(date, defaultEndTime, timezone);
      }
      setInternalValue(newRange);
    }
  };

  const handleTimeChange = (type: 'start' | 'end', timeStr: string) => {
    if (!internalValue.startDate || !internalValue.endDate) return;

    const newRange = { ...internalValue };
    if (type === 'start') {
      newRange.startDate = DateTimeUtils.updateDateWithTimeInTimezone(
        new Date(internalValue.startDate),
        timeStr,
        timezone
      );
    } else {
      newRange.endDate = DateTimeUtils.updateDateWithTimeInTimezone(
        new Date(internalValue.endDate),
        timeStr,
        timezone
      );
    }

    setInternalValue(newRange);
  };

  const handleApply = () => {
    if (internalValue.startDate && internalValue.endDate) {
      onChange(internalValue);
      setIsCalendarOpen(false);
    }
  };

  const handleCancel = () => {
    setInternalValue(value);
    setIsCalendarOpen(false);
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
          value={internalValue.startDate || internalValue.endDate ? 
            `${formatDisplayDate(internalValue.startDate)} - ${formatDisplayDate(internalValue.endDate)}` :
            ''}
          className="date-input"
        />
      </div>

      {isCalendarOpen && (
        <div className="calendar-popup">
          <div className="date-range-picker">
            <Calendar
              currentMonth={currentMonth}
              value={internalValue}
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
              {internalValue.startDate && (
                <div className="mb-1">
                  Start: {formatDisplayDate(internalValue.startDate)}
                </div>
              )}
              {internalValue.endDate && (
                <div>
                  End: {formatDisplayDate(internalValue.endDate)}
                </div>
              )}
            </div>

            {enableTimeSelection && (
              <TimeSelection
                value={internalValue}
                timezone={timezone}
                showTimeSelection={showTimeSelection}
                onTimeSelectionToggle={setShowTimeSelection}
                onTimeChange={handleTimeChange}
                getTimeFromISO={(date) => DateTimeUtils.retrieveTimeInTimezone(date, timezone)}
              />
            )}

            <div className="calendar-actions">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleApply}
                disabled={!internalValue.startDate || !internalValue.endDate}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 