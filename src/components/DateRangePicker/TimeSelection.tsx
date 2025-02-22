import React from 'react';
import { DateRange } from './types';

interface TimeSelectionProps {
  value: DateRange;
  timezone: string;
  showTimeSelection: boolean;
  onTimeSelectionToggle: (show: boolean) => void;
  onTimeChange: (type: 'start' | 'end', time: string) => void;
  getTimeFromISO: (isoString: string | null) => string;
}

export const TimeSelection: React.FC<TimeSelectionProps> = ({
  value,
  timezone,
  showTimeSelection,
  onTimeSelectionToggle,
  onTimeChange,
  getTimeFromISO,
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
          Add time selection
        </label>
      </div>

      {showTimeSelection && (
        <div className="time-selection-inputs">
          <div className="time-input-group">
            <label>From:</label>
            <input
              type="time"
              value={getTimeFromISO(value.startDate)}
              onChange={(e) => onTimeChange('start', e.target.value)}
              disabled={!value.startDate}
            />
          </div>
          <div className="time-input-group">
            <label>To:</label>
            <input
              type="time"
              value={getTimeFromISO(value.endDate)}
              onChange={(e) => onTimeChange('end', e.target.value)}
              disabled={!value.endDate}
            />
          </div>
        </div>
      )}
    </>
  );
}; 