import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { DateRange, DateRangePickerProps } from "./types";
import { Calendar } from "./Calendar";
import { TimeSelection } from "./TimeSelection";
import { DateRangePickerUtils } from "./dateRangeUtils";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { CalendarIcon } from "lucide-react";
import "./DateRangePicker.css";
import { DateUtils } from "../../utils/dateUtils";

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  maxDays = 10,
  maxPastDays = 90,
  timezone = "UTC",
  dateMessages = [],
  enableTimeSelection = false,
}) => {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showTimeSelection, setShowTimeSelection] =
    useState(enableTimeSelection);
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
        left: rect.left + window.scrollX,
      });
    }
  }, [isCalendarOpen]);

  const formatDisplayDate = (
    date: Date | null,
    showOffset = false,
    hideYear = false
  ): string => {
    if (!date) return "";

    const dateFormat = hideYear
      ? {
          month: "short",
          day: "numeric",
          ...(enableTimeSelection && {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timeZone: timezone,
        }
      : {
          year: "numeric",
          month: "short",
          day: "numeric",
          ...(enableTimeSelection && {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timeZone: timezone,
        };

    const formattedDate = new Intl.DateTimeFormat("default", dateFormat).format(
      date
    );
    return showOffset
      ? `${formattedDate} ${DateUtils.getTimezoneOffset(date, timezone)}`
      : formattedDate;
  };

  const handleDateClick = (date: Date) => {
    if (DateRangePickerUtils.isDateDisabled(date, maxPastDays, dateMessages))
      return;

    let newRange: DateRange = { ...internalValue };

    if (
      !internalValue.startDate ||
      (internalValue.startDate && internalValue.endDate)
    ) {
      newRange = {
        startDate: DateUtils.getDate(date, { startOfDay: true }),
        endDate: null,
      };
      setInternalValue(newRange);
    } else {
      const startDate = internalValue.startDate;

      if (DateUtils.isBefore(date, startDate)) {
        newRange = {
          startDate: DateUtils.getDate(date, { startOfDay: true }),
          endDate: DateUtils.getDate(startDate, { endOfDay: true }),
        };
      } else {
        const daysDiff = DateUtils.daysDifference(date, startDate);
        if (daysDiff > maxDays) return;

        newRange = {
          startDate,
          endDate: DateUtils.getDate(date, { endOfDay: true }),
        };
      }
      setInternalValue(newRange);
    }
  };

  const handleTimeChange = (type: "start" | "end", timeStr: string) => {
    if (!internalValue.startDate || !internalValue.endDate) return;

    const newRange = { ...internalValue };

    if (type === "start") {
      newRange.startDate = DateUtils.setTimeInDate(
        internalValue.startDate,
        timeStr,
        timezone
      );
    } else {
      const newDate = DateUtils.setTimeInDate(
        internalValue.endDate,
        timeStr,
        timezone
      );
      newDate.setSeconds(59);
      newDate.setMilliseconds(999);
      newRange.endDate = newDate;
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDateRange =
    internalValue.startDate || internalValue.endDate
      ? `${formatDisplayDate(
          internalValue.startDate,
          false,
          internalValue.startDate?.getFullYear() ===
            internalValue.endDate?.getFullYear()
        )} - ${formatDisplayDate(internalValue.endDate, true)}`
      : "";

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
          value={selectedDateRange}
        />
      </div>

      {isCalendarOpen &&
        createPortal(
          <div
            className="calendar-popup"
            style={{
              position: "absolute",
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`,
            }}
            ref={popupRef}
          >
            <div className="date-range-picker">
              <Calendar
                value={internalValue}
                maxDays={maxDays}
                onDateClick={handleDateClick}
                isDateDisabled={(date) =>
                  DateRangePickerUtils.isDateDisabled(
                    date,
                    maxPastDays,
                    dateMessages
                  )
                }
                getDateMessage={(date) =>
                  DateRangePickerUtils.getDateMessage(date, dateMessages)
                }
                hoveredDate={hoveredDate}
                onDateHover={setHoveredDate}
                onDateLeave={() => setHoveredDate(null)}
                timezone={timezone}
              />

              <div className="selected-range">
                {internalValue.startDate && (
                  <div className="mb-1">
                    Start: {formatDisplayDate(internalValue.startDate)}
                  </div>
                )}
                {internalValue.endDate && (
                  <div>End: {formatDisplayDate(internalValue.endDate)}</div>
                )}
              </div>

              {enableTimeSelection && (
                <TimeSelection
                  value={internalValue}
                  showTimeSelection={showTimeSelection}
                  onTimeSelectionToggle={setShowTimeSelection}
                  onTimeChange={handleTimeChange}
                  getTimeString={(date: Date | null) =>
                    DateUtils.getTimeInTimezone(date, timezone)
                  }
                />
              )}

              <div className="calendar-actions">
                <Button variant="outline" size="sm" onClick={handleCancel}>
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
