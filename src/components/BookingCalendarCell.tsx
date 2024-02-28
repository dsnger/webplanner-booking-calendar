import React from 'react';
import { formatDate } from "../utils/dateUtils";
import { isLastDayOfMonth } from "date-fns";
import { DateRangeType } from "../types";

interface BookingCalendarCellProps {
  date: Date;
  objId: string;
  isSelected: boolean;
  selectClasses: string | '';
  content: React.ReactNode;
  tooltip: string | null;
  onClick: () => void;
  onMouseEnter: () => void;
  statusFlags: {
    isToday: boolean;
    isUnavailable: boolean;
    type: DateRangeType | null;
    isUnavailStart: boolean;
    isUnavailEnd: boolean;
    isDisabled: boolean;
    isArrival: boolean;
    isDeparture: boolean;
    isHoveredCell: boolean;
    isInPast: boolean;
  };
}

const BookingCalendarCell: React.FC<BookingCalendarCellProps> = React.memo(({ date, objId, selectClasses, content, onClick, onMouseEnter, statusFlags }) => {
  
  const { isUnavailable, type, isUnavailStart, isUnavailEnd, isDisabled, isArrival, isDeparture, isHoveredCell, isInPast } = statusFlags;

  const cellClassNames = [
    // 'cell cell-day h-9 min-w-9',
    isDisabled && !isHoveredCell ? 'bg-gray-200 text-gray-30 ' : 'bg-green-300 hover:bg-green-500 text-green-600',
    // isToday ? 'bg-green-100/50 text-green-600' : '',
    isUnavailable ? 'is-unavailable' : '',
    isUnavailStart ? 'is-unavailable is-unavail-start' : '',
    type ? `is-${type}` : '',
    isUnavailEnd ? 'is-unavailable is-unavail-end' : '',
    isArrival ? 'is-arrival' : '',
    isDeparture ? 'is-departure' : '',
    isHoveredCell ? 'bg-green-600/50' : '',
    isInPast ? 'opacity-30' : '',
  ].filter(Boolean).join(' ');


  return (
    <td
      className={`cell cell-day h-9 min-w-9 ${isLastDayOfMonth(date) ? 'last-of-month border-r-2' : ''} ${selectClasses}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      data-object-id={objId}
      data-date-string={formatDate(date)}
    >
      <div
        className={`cell-marker w-full h-full ${cellClassNames} `}
      >
        {content}
      </div>
  
    </td>
  );
});

export default BookingCalendarCell;
