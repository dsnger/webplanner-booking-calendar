import React, { useContext } from 'react';
import { useSettings } from "@/hooks/useSettings";
import ArrivalDayIcon from "./icons/ArrivalDayIcon";
import DepartureDayIcon from "./icons/DepartureDayIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import DaysContext from "@/context/DaysContext";

interface DayContentProps {
  day: Date;
  rowIndex: number;
  columnIndex: number;
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
  isSelectingRow,
  hasArrivalOnly,
  hasNoExplicitDays,
  handleDayClick,
  handleHover,
  handleMouseLeave
}) => {
  const { calendarSettings } = useSettings();
  const { daysWithStatus } = useContext(DaysContext);
  const status = daysWithStatus[rowIndex][columnIndex];

  const iconFillColor = calendarSettings[0].colorSettings.available;
  const cellWidth = parseFloat(calendarSettings[0].cellSettings.cellWidth);
  const dayContent = (
    <div
      className={`h-cell-height relative stroke-current fill-day [fill-opacity:0.65] ${isSelectingRow ? 'cursor-col-resize' : 'cursor-pointer'} ${status.isUnavailable ? 'is-unavailable' : 'is-available'} ${status.isArrival ? 'is-arrival' : ''}  ${status.isDeparture ? 'is-departure bg-slate-500' : ''}`}
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
      <div className="h-full mw-full m-0 p-0 flex text-black">
        {status.isArrival ? (
          <ArrivalDayIcon iconFill={iconFillColor} iconStroke={iconFillColor} cellWidth={cellWidth} className={`${isSelectingRow ? 'opacity-25' : ''}`} />
        ) : status.isDeparture ? (
          <DepartureDayIcon iconFill={iconFillColor} iconStroke={iconFillColor} cellWidth={cellWidth} className={`${!isSelectingRow ? 'opacity-25' : ''}`} />
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
