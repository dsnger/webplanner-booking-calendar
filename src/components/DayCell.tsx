import React from 'react';

interface DayCellProps {
  date: Date;
  objectId: number;
  isDayInRange: (date: Date) => boolean;
  onDayClick: (date: Date) => void;
  formatDate: (date: Date) => string;
  isUnavailable: boolean;
  tooltip: string | null;
}

const DayCell: React.FC<DayCellProps> = ({ date, objectId, isDayInRange, onDayClick, formatDate, isUnavailable, tooltip}) => {
  const dateString = formatDate(date);

  return (
    <td className={`h-6 border-l border-r border-b border-gray-500`}>
      <div
      className={`px-4 h-6 cursor-pointer ${isDayInRange(date) ? 'bg-blue-200' : ''} ${isUnavailable ? 'bg-red-200 cursor-default' : ''}`}
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