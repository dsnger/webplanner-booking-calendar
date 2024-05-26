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
import ArrivalDayIcon from "./icons/ArrivalDayIcon";
import DepartureDayIcon from "./icons/DepartureDayIcon";



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
    isUnavailStartHalf: boolean;
    isUnavailEndHalf: boolean;
    isDisabled: boolean;
    isArrival: boolean;
    isDeparture: boolean;
    isHoveredCell: boolean;
    isInPast: boolean;
  };
}

const BookingCalendarCell: React.FC<BookingCalendarCellProps> = React.memo(({ date, objId, selectClasses, tooltip, content, onClick, onMouseEnter, statusFlags }) => {

  const { isUnavailable, isUnavailStartHalf, isUnavailEndHalf, isDisabled, isArrival, isDeparture, isHoveredCell, isInPast } = statusFlags;

  const cellClassNames = [
    // 'cell cell-day h-9 min-w-9',
    isDisabled && !isHoveredCell ? 'is-disabled bg-gray-200 text-gray-30' : (!isUnavailable || !isUnavailStartHalf || !isUnavailEndHalf  ? 'bg-day-available hover:bg-day-hover hover:cursor-pointer' : ''),

    isArrival ? 'is-available is-arrival hover:cursor-pointer hover:bg-day-hover' : '',
    isDeparture ? 'is-available is-departure hover:cursor-pointer hover:bg-day-hover' : '',

    isInPast ? 'opacity-10' : '',
  ].filter(Boolean).join(' ');


  let message = '';
  if (isArrival && !isUnavailable) {
    message = 'Anreisetag';
  }

  if (isDeparture && !isUnavailable) {
    message = 'Abreisetag';
  }


  return (
    <div
      className={`cell border-l border-white p-0 m-0 cell-day h-cell-height w-cell-width ${isLastDayOfMonth(date) ? 'last-of-month' : ''} ${cellClassNames} ${selectClasses}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      data-object-id={objId}
      data-date-string={formatDate(date)}
    >
      {tooltip || message ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-8 min-w-8 m-0 p-0 flex">
                <div
                  className={`cell-marker w-full h-full `}
                >
                  {isArrival && !isUnavailable ? (<ArrivalDayIcon cellWidth={32}/>) : ''}
                  {isDeparture && !isUnavailable ? (<DepartureDayIcon cellWidth={32}/>) : ''}
                  {content}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}{message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="flex">
          <div
            className={`cell-marker w-full h-full`}
            >
            {isArrival && !isUnavailable ? (<ArrivalDayIcon cellWidth={32}/>) : ''}
            {isDeparture && !isUnavailable ? (<DepartureDayIcon cellWidth={32}/>) : ''}
            {content}
          </div>
        </div>
      )}
    </div>
  );
});

export default BookingCalendarCell;
