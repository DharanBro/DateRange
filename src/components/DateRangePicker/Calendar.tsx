import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tooltip } from '../Tooltip/Tooltip';
import { DateRange } from './types';

interface CalendarProps {
  value: DateRange;
  maxDays: number;
  onDateClick: (date: Date) => void;
  isDateDisabled: (date: Date) => boolean;
  getDateMessage: (date: Date) => string | null;
  hoveredDate: Date | null;
  onDateHover: (date: Date) => void;
  onDateLeave: () => void;
  timezone: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  value,
  maxDays,
  onDateClick,
  isDateDisabled,
  getDateMessage,
  hoveredDate,
  onDateHover,
  onDateLeave,
  timezone,
}) => {

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = Array(startingDayOfWeek).fill(null);
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isDateSelected = (calendarDate: Date, date: Date | null): boolean => {
    if (!date) return false;
    // TODO: This is a hack to get the date in the correct format
    // This is due to the timezone. Fix it in a better way.
    const actualDay = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(date)

    const day = actualDay.find(part => part.type === 'day')?.value as string
    const month = actualDay.find(part => part.type === 'month')?.value as string
    const year = actualDay.find(part => part.type === 'year')?.value as string
    
    const isSameDay = calendarDate.getFullYear() === parseInt(year) &&  
           calendarDate.getMonth() === parseInt(month) - 1 &&
           calendarDate.getDate() === parseInt(day)
    return isSameDay;
  };

  const isInPreviewRange = (date: Date): boolean => {
    if (!value.startDate || !hoveredDate || value.endDate) return false;
    const start = new Date(value.startDate);
    const end = hoveredDate;
    return date >= (start < end ? start : end) && date <= (start < end ? end : start);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <>
      <div className="calendar-header">
        <button 
          className="text-sm icon-button"
          onClick={() => {
            const newDate = new Date(currentMonth);
            newDate.setMonth(currentMonth.getMonth() - 1);
            setCurrentMonth(newDate);
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-lg font-medium">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button 
          className="text-sm icon-button"
          onClick={() => {
            const newDate = new Date(currentMonth);
            newDate.setMonth(currentMonth.getMonth() + 1);
            setCurrentMonth(newDate);
          }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
        
        {getDaysInMonth(currentMonth).map((date, index) => {
          if (date === null) {
            return <div key={`empty-${index}`} className="calendar-day empty" />;
          }

          const isDisabled = isDateDisabled(date);
          const message = getDateMessage(date);
          const isStart = isDateSelected(date, value.startDate);
          const isEnd = isDateSelected(date, value.endDate);
          const inRange = value.startDate && value.endDate && 
            date >= new Date(value.startDate) && date <= new Date(value.endDate);
          const inPreview = isInPreviewRange(date);
          
          const classNames = [
            'calendar-day',
            isDisabled ? 'disabled' : '',
            isStart ? 'selected-start' : '',
            isEnd ? 'selected-end' : '',
            !isStart && !isEnd && inRange ? 'in-range' : '',
            !isStart && !isEnd && inPreview ? 'in-preview-range' : '',
            isToday(date) ? 'today' : '',
            message ? 'has-message' : ''
          ].filter(Boolean).join(' ');

          const getTooltipContent = () => {
            if (value.startDate && !value.endDate) {
              const daysDiff = Math.ceil(
                Math.abs(date.getTime() - new Date(value.startDate).getTime()) / (1000 * 60 * 60 * 24)
              );
              if (daysDiff > maxDays) {
                return `Cannot select more than ${maxDays} days`;
              }
            }
            return message || '';
          };
          
          return (
            <Tooltip 
              key={date.toISOString()}
              content={getTooltipContent()}
              position="top"
              fullWidth
              fullHeight
            >
              <div
                className={classNames}
                onClick={() => !isDisabled && onDateClick(date)}
                onMouseEnter={() => onDateHover(date)}
                onMouseLeave={onDateLeave}
              >
                {date.getDate()}
              </div>
            </Tooltip>
          );
        })}
      </div>
    </>
  );
}; 