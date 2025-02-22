import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DateRange, DateRangePickerProps } from './types';
import { Calendar } from './Calendar';
import { TimeSelection } from './TimeSelection';
import { DateTimeUtils } from '../../utils/DateTimeUtils';
import { DateRangePickerUtils } from './dateRangeUtils';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { CalendarIcon } from 'lucide-react';
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
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const inputRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Update popup position when calendar opens
  useEffect(() => {
    if (isCalendarOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setPopupPosition({
        top: rect.bottom + window.scrollY + 4, // 4px gap
        left: rect.left + window.scrollX
      });
    }
  }, [isCalendarOpen]);

  const formatDisplayDate = (dateStr: string | null): string => {
    return DateRangePickerUtils.formatDisplayDate(dateStr, timezone, enableTimeSelection);
  };

  const handleDateClick = (date: Date) => {
    if (DateRangePickerUtils.isDateDisabled(date, maxPastDays, dateMessages, timezone)) return;

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

  // Update click outside handler to check both refs
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInputClick = inputRef.current?.contains(target);
      const isPopupClick = popupRef.current?.contains(target);
      
      if (!isInputClick && !isPopupClick) {
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
        ref={inputRef}
      >
        <Input
          readOnly
          icon={<CalendarIcon size={18} />}
          placeholder="Select date range"
          value={internalValue.startDate || internalValue.endDate ? 
            `${formatDisplayDate(internalValue.startDate)} - ${formatDisplayDate(internalValue.endDate)}` :
            ''}
        />
      </div>

      {isCalendarOpen && createPortal(
        <div 
          className="calendar-popup"
          style={{
            position: 'absolute',
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`
          }}
          ref={popupRef}
        >
          <div className="date-range-picker">
            <Calendar
              currentMonth={currentMonth}
              value={internalValue}
              maxDays={maxDays}
              timezone={timezone}
              onDateClick={handleDateClick}
              onMonthChange={setCurrentMonth}
              isDateDisabled={(date) => DateRangePickerUtils.isDateDisabled(date, maxPastDays, dateMessages)}
              getDateMessage={(date) => DateRangePickerUtils.getDateMessage(date, dateMessages, timezone)}
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
        </div>,
        document.body
      )}
    </div>
  );
}; 