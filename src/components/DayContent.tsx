import { useSettings } from "@/hooks/useSettings";
import ArrivalDayIcon from "./icons/ArrivalDayIcon";
import DepartureDayIcon from "./icons/DepartureDayIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";


interface DayContentProps {
  day: Date;
  rowIndex: number;
  columnIndex: number;
  isArrivalDay: boolean;
  isDepartureDay: boolean;
  hasArrivalOnly: boolean;
  isAvailable: boolean;
  hasNoExplicitDays: boolean;
  isSelectingRow: boolean;
  handleDayClick: (date: Date, rowIndex: number, columnIndex: number, hasArrivalOnly: boolean, hasNoExplicitDays: boolean, isArrivalDay: boolean, isDepartureDay: boolean) => void;
  handleHover: (date: Date, rowIndex: number, columnIndex: number, hasNoExplicitDays: boolean, isArrivalDay: boolean) => void;
  handleMouseLeave: () => void;
}

const DayContent: React.FC<DayContentProps> = ({
  day,
  rowIndex,
  columnIndex,
  isArrivalDay,
  isDepartureDay,
  hasArrivalOnly,
  isAvailable,
  hasNoExplicitDays,
  isSelectingRow,
  handleDayClick,
  handleHover,
  handleMouseLeave
}) => {
  const iconFillColor = useSettings().calendarSettings[0].colorSettings.available;
  const cellWidth = parseFloat(useSettings().calendarSettings[0].cellSettings.cellWidth);

  const dayContent = (
    <div
      className={`h-cell-height relative stroke-current fill-day [fill-opacity:0.65] ${isSelectingRow ? 'cursor-col-resize' : 'cursor-pointer'} ${isAvailable ? 'is-available' : 'is-unavailable'}`}
      style={{
        display: 'block',
        gridColumnStart: columnIndex + 1,
        gridColumnEnd: columnIndex + 1,
        gridRow: rowIndex + 1,
      }}
      onClick={() => handleDayClick(day, rowIndex, columnIndex, hasArrivalOnly, hasNoExplicitDays, isArrivalDay, isDepartureDay)}
      onMouseEnter={() => handleHover(day, rowIndex, columnIndex, hasNoExplicitDays, isArrivalDay)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="h-full mw-full m-0 p-0 flex text-black">
        {isArrivalDay ? (
          <ArrivalDayIcon iconFill={iconFillColor} iconStroke={iconFillColor} cellWidth={cellWidth} className={`${isSelectingRow ? 'opacity-25' : ''}`} />
        ) : isDepartureDay ? (
          <DepartureDayIcon iconFill={iconFillColor} iconStroke={iconFillColor} cellWidth={cellWidth} className={`${!isSelectingRow ? 'opacity-25' : ''}`}/>
        ) : null}
      </div>
    </div>
  );

  if (isArrivalDay || isDepartureDay) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            {dayContent}
          </TooltipTrigger>
          <TooltipContent>
            <p>{isArrivalDay ? 'Anreisetag' : 'Abreisetag'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return dayContent;
};


export default DayContent;