import React from 'react';
import { formatDate } from "../utils";
import { isLastDayOfMonth, isSameDay } from "date-fns";

interface BookingCalendarCellProps {
  date: Date;
  objId: string;
  isSelected: boolean;
  isToday: boolean;
  content: React.ReactNode;
  onClick: () => void;
}

const BookingCalendarCell: React.FC<BookingCalendarCellProps> = React.memo(({ date, objId,isSelected, isToday, content, onClick }) => {

  const cellClassNames = [
    'cell cell-day h-9 min-w-9',
    isSelected ? 'is-selected' : '',
    isToday ? 'bg-green-100/10' : '',
  ].join(' ').trim();

  return (
    <td className={`${cellClassNames} ${isLastDayOfMonth(date) ? 'last-of-month border-r-2' : ''} `} onClick={onClick}>
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
