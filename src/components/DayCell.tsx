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

  const isInRange = isDayInRange(date);
  const tdClasses = `h-6 border-l border-r border-b border-gray-500 ${isInRange ? 'bg-blue-200' : ''} ${isUnavailable ? 'bg-red-200 cursor-default' : ''}${!isUnavailable ? cellState.join(' ') : ''}`;
  const divClasses = `px-4 h-6 cursor-pointer ${!isUnavailable && isInRange || isSelected ? 'bg-blue-200' : ''} ${isUnavailable ? 'bg-red-200 cursor-default ' : ''} ${!isUnavailable ? cellState.join(' ') : ''}`;


  const handleClick = () => {
    if (!isUnavailable) {
      // handleToggleClass();
      onDayClick(date);
    }
  };


  return (
    <td className={tdClasses}>
      <div
        className={divClasses}
        data-object-id={objectId}
        data-date={dateString}
        onClick={handleClick}
        title={tooltip || undefined}
      >
        {/* This is the clickable/selectable cell */}
      </div>
    </td>
  );
};


export default DayCell;