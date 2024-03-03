import React from 'react';
import { formatDate } from "../utils/dateUtils";
import { isLastDayOfMonth } from "date-fns";
import { DateRangeType } from "../types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"


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

const BookingCalendarCell: React.FC<BookingCalendarCellProps> = React.memo(({ date, objId, isSelected, selectClasses, tooltip, content, onClick, onMouseEnter, statusFlags }) => {

  const { isUnavailable, type, isUnavailStart, isUnavailEnd, isDisabled, isArrival, isDeparture, isHoveredCell, isInPast } = statusFlags;

  const cellClassNames = [
    // 'cell cell-day h-9 min-w-9',
    isDisabled && !isHoveredCell ? 'bg-gray-200 text-gray-30 ' : 'bg-green-300 hover:bg-green-500 text-green-600',
    // isToday ? 'bg-green-100/50 text-green-600' : '',
    isUnavailable ? 'is-unavailable border-l-0' : '',
    isUnavailStart ? 'is-unavailable is-unavail-start rounded-md' : '',
    type ? `is-${type}` : '',
    isUnavailEnd ? 'is-unavailable is-unavail-end rounded-md' : '',
    isArrival ? 'is-arrival' : '',
    isDeparture ? 'is-departure' : '',
    isHoveredCell ? 'bg-green-600/50' : '',
    isInPast ? 'opacity-30' : '',
    isSelected ? 'bg-green-600 border-r-0 border-l-0' : ''
  ].filter(Boolean).join(' ');


  return (
    <td
      className={`border-l border-white p-0 m-0 hover:cursor-pointer cell-day h-9 min-w-9 ${isLastDayOfMonth(date) ? 'last-of-month border-r-2' : ''} ${cellClassNames} ${selectClasses}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      data-object-id={objId}
      data-date-string={formatDate(date)}
    >
     {tooltip ? (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`cell-marker w-full h-full `}
            >
              {content}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : (
      <div
        className={`cell-marker w-full h-full`}
      >
        {content}
      </div>
    )}
    </td>
  );
});

export default BookingCalendarCell;
