import React from 'react';
import { CellState } from "../types";


interface DayCellProps {
  date: Date;
  objectId: number;
  isDayInRange: (date: Date) => boolean;
  onDayClick: (date: Date) => void;
  formatDate: (date: Date) => string;
  isUnavailable: boolean;
  isSelected: boolean;
  cellState: CellState;
  tooltip: string | null;
}

const DayCell: React.FC<DayCellProps> = ({ date, objectId, isDayInRange, onDayClick, formatDate, isUnavailable, isSelected, cellState, tooltip }) => {

  const dateString = formatDate(date);

  return (
    <td className={`h-6 border-l border-r border-b border-gray-500 ${isDayInRange(date) ? 'bg-blue-200 is-marked' : ''} ${isUnavailable ? 'bg-red-200 cursor-default is-unavailable' : ''} `}>
      <div
        className={`px-4 h-6 cursor-pointer ${isDayInRange(date) ? 'bg-blue-200 is-marked' : 'is-available'} ${isUnavailable ? 'bg-red-200 cursor-default is-unavailable' : ''} `}
        data-object-id={objectId}
        data-date={dateString}
        onClick={() => !isUnavailable && onDayClick(date)}
        title={tooltip !== null ? tooltip : undefined}
      >
        {/* This is the clickable/selectable cell */}
      </div>
    </td>
  );
};

export default DayCell;