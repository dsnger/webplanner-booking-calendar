import React from 'react';
import { useSettings } from "@/hooks/useSettings";
import ArrivalDayIcon from "./icons/ArrivalDayIcon";
import DepartureDayIcon from "./icons/DepartureDayIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { DayStatus } from "@/types";

interface DayContentProps {
  day: Date;
  rowIndex: number;
  columnIndex: number;
  status: DayStatus;
  isSelectingRow: boolean;
  hasArrivalOnly: boolean;
  hasNoExplicitDays: boolean;
  handleDayClick: (date: Date, rowIndex: number, columnIndex: number, hasArrivalOnly: boolean, hasNoExplicitDays: boolean, isArrivalDay: boolean, isDepartureDay: boolean) => void;
  handleHover: (date: Date, rowIndex: number, columnIndex: number, hasNoExplicitDays: boolean, isArrivalDay: boolean) => void;
  handleMouseLeave: () => void;
}

const DayContent: React.FC<DayContentProps> = ({
  day,
  rowIndex,
  columnIndex,
  status,
  isSelectingRow,
  hasArrivalOnly,
  hasNoExplicitDays,
  handleDayClick,
  handleHover,
  handleMouseLeave
}) => {
  const { calendarSettings } = useSettings();

  const iconFillColor = calendarSettings[0].colorSettings.available;
  const iconFillColorUnavailable = calendarSettings[0].colorSettings.notAvailable;
  const cellWidth = parseFloat(calendarSettings[0].cellSettings.cellWidth);
  const dayContent = (
    <div
      className={`h-cell-height relative ${isSelectingRow ? 'cursor-col-resize' : ''}
      ${(!isSelectingRow && hasArrivalOnly && status.isArrival) || (!isSelectingRow && hasNoExplicitDays) ? 'cursor-pointer' : ''}
      ${!isSelectingRow && hasArrivalOnly && !status.isArrival ? 'cursor-not-allowed' : ''}
      ${!isSelectingRow && !hasArrivalOnly && (status.isArrival || hasNoExplicitDays) ? 'cursor-pointer' : 'cursor-pointer'}
      ${isSelectingRow && !hasNoExplicitDays && status.isDeparture ? 'cursor-pointer' : ''}
      ${!isSelectingRow && !hasNoExplicitDays && status.isDeparture ? 'cursor-not-allowed' : ''}
      ${status.isUnavailable ? 'is-unavailable' : 'is-available'} ${status.isArrival ? 'is-arrival' : ''}
      ${status.isDeparture ? 'is-departure' : ''}`}
      style={{
        display: 'block',
        gridColumnStart: columnIndex + 1,
        gridColumnEnd: columnIndex + 1,
        gridRow: rowIndex + 1,
      }}
      onClick={() => handleDayClick(day, rowIndex, columnIndex, hasArrivalOnly, hasNoExplicitDays, status.isArrival, status.isDeparture)}
      onMouseEnter={() => handleHover(day, rowIndex, columnIndex, hasNoExplicitDays, status.isArrival)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="h-full mw-full m-0 p-0 flex text-black [fill-opacity:0.65]">
        {status.isArrival ? (
          <ArrivalDayIcon iconFill={`${!isSelectingRow || hasArrivalOnly ? iconFillColor : iconFillColorUnavailable }`} iconStroke={`${!isSelectingRow || hasArrivalOnly ? iconFillColor : iconFillColorUnavailable }`} cellWidth={cellWidth} className={`${isSelectingRow ? 'opacity-15' : ''}`} />
        ) : status.isDeparture ? (
          <DepartureDayIcon iconFill={`${isSelectingRow ? iconFillColor : iconFillColorUnavailable }`} iconStroke={`${isSelectingRow ? iconFillColor : iconFillColorUnavailable}`} cellWidth={cellWidth} className={`${isSelectingRow ? '' : 'opacity-15'}`} />
        ) : null}
      </div>
    </div>
  );

  if (status.isArrival || status.isDeparture) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            {dayContent}
          </TooltipTrigger>
          <TooltipContent>
            <p>{status.isArrival ? 'Anreisetag' : 'Abreisetag'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return dayContent;
};

export default DayContent;
