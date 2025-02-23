import React from "react";
import { DateRange } from "./types";

interface TimeSelectionProps {
  value: DateRange;
  showTimeSelection: boolean;
  onTimeSelectionToggle: (show: boolean) => void;
  onTimeChange: (type: "start" | "end", time: string) => void;
  getTimeString: (date: Date | null) => string;
}

export const TimeSelection: React.FC<TimeSelectionProps> = ({
  value,
  showTimeSelection,
  onTimeSelectionToggle,
  onTimeChange,
  getTimeString,
}) => {
  return (
    <>
      <div className="time-selection-toggle">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showTimeSelection}
            onChange={(e) => onTimeSelectionToggle(e.target.checked)}
          />
          <span>Add time selection</span>
        </label>
      </div>

      {showTimeSelection && (
        <div className="time-selection-inputs">
          <div className="time-input-group">
            <label htmlFor="time-start">From:</label>
            <input
              id="time-start"
              type="time"
              value={getTimeString(value.startDate)}
              onChange={(e) => onTimeChange("start", e.target.value)}
              disabled={!value.startDate}
            />
          </div>
          <div className="time-input-group">
            <label htmlFor="time-end">To:</label>
            <input
              id="time-end"
              type="time"
              value={getTimeString(value.endDate)}
              onChange={(e) => onTimeChange("end", e.target.value)}
              disabled={!value.endDate}
            />
          </div>
        </div>
      )}
    </>
  );
};
