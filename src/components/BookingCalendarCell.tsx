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
  statusFlags: {
    isToday: boolean;
    isUnavailable: boolean;
    type: DateRangeType | null;
    isUnavailStart: boolean;
    isUnavailEnd: boolean;
    isArrival: boolean;
    isDeparture: boolean;
  };
}

const BookingCalendarCell: React.FC<BookingCalendarCellProps> = React.memo(({ date, objId, selectClasses,content, onClick, statusFlags }) => {
  
  const { isToday, isUnavailable, type, isUnavailStart, isUnavailEnd, isArrival, isDeparture } = statusFlags;

  const cellClassNames = [
    'cell cell-day h-9 min-w-9',
    // isSelected ? 'is-selected' : '',
    isToday ? 'bg-green-100/10 text-green-600' : '',
    isUnavailable ? 'is-unavailable' : '',
    type ? `is-${type}` : '',
    isUnavailStart ? 'is-unavail-start' : '',
    isUnavailEnd ? 'is-unavail-end' : '',
    isArrival ? 'is-arrival' : '',
    isDeparture ? 'is-departure' : '',
  ].filter(Boolean).join(' ');



  return (
    <td className={`${cellClassNames} ${isLastDayOfMonth(date) ? 'last-of-month border-r-2' : ''} ${selectClasses}`} onClick={onClick}>
      <div
        className="cell-marker w-full h-full pointer-events-none"
        data-object-id={objId}
        data-date-string={formatDate(date)}>
          {content}
      </div>
  
    </td>
  );
});

export default BookingCalendarCell;
