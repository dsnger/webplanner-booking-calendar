import ArrivalDayIcon from "./icons/ArrivalDayIcon";
import DepartureDayIcon from "./icons/DepartureDayIcon"; // Assuming you have a separate icon for departure days
import { useSettings } from "@/hooks/useSettings";
import { useDays } from "@/hooks/useDays";
import { useBookingObjects } from "@/hooks/useBookingObjects";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useSelectedDates } from "@/hooks/useSelectedDates";
import DynamicRange from "./DynamicRange";

const ArrivalAndDepartureDays: React.FC = () => {
  const { calendarSettings } = useSettings();
  const { bookingObjects } = useBookingObjects();
  const { days, daysWithStatus } = useDays();
  const { startSelection, finalizeSelection, selectedStartDate, isSelecting, handleDayHover, resetHoveredDay } = useSelectedDates();

  const cellColCount = days.length;
  const cellWidth = parseFloat(calendarSettings[0].cellSettings.cellWidth);
  const iconFillColor = calendarSettings[0].colorSettings.available;

  if (!Array.isArray(bookingObjects)) {
    console.error('bookingObjects is not an array:', bookingObjects);
    return <div>Invalid booking data</div>;
  }

  const handleDayClick = (date: Date, rowIndex: number, columnIndex: number, hasArrivalOnly: boolean, hasNoExplicitDays: boolean) => {
    if (hasArrivalOnly || hasNoExplicitDays) {
      if (!isSelecting) {
        startSelection(date, rowIndex, columnIndex);
      } else {
        finalizeSelection(date, rowIndex, columnIndex);
      }
    } else {
      const dayType = bookingObjects[rowIndex].dayTypes?.arrivalDays?.dates.includes(date.toISOString().split('T')[0]) ? 'arrival' : 'departure';
      if (dayType === 'arrival') {
        startSelection(date, rowIndex, columnIndex);
      } else if (dayType === 'departure') {
        finalizeSelection(date, rowIndex, columnIndex);
      }
    }
  };

  const handleHover = (date: Date, rowIndex: number, columnIndex: number, hasNoExplicitDays: boolean, isArrivalDay: boolean) => {
    if (isArrivalDay || hasNoExplicitDays) {
      handleDayHover(date, rowIndex, columnIndex);
    }
  };



  const handleMouseLeave = () => {
    resetHoveredDay();
  };

  return (
    <div
      className="grid z-20 relative"
      style={{
        width: `calc(${cellColCount} * (var(--cell-width) + var(--cell-gap)))`,
        gridTemplateColumns: `repeat(${cellColCount}, 1fr)`,
        gridTemplateRows: `repeat(${bookingObjects.length}, var(--cell-height))`,
        rowGap: `var(--cell-gap)`,
      }}
    >
      <DynamicRange />
      {bookingObjects.map((bookingObject, rowIndex) => {
        const arrivalDates = bookingObject.dayTypes?.arrivalDays?.dates || [];
        const departureDates = bookingObject.dayTypes?.departureDays?.dates || [];
        const hasArrivalOnly = arrivalDates.length > 0 && departureDates.length === 0;
        const hasNoExplicitDays = arrivalDates.length === 0 && departureDates.length === 0;

        return days.map((day, dayIndex) => {
          const dateString = day.toISOString().split('T')[0];
          const isArrivalDay = arrivalDates.includes(dateString);
          const isDepartureDay = departureDates.includes(dateString);

          // Skip rendering days that are neither arrival nor departure, except for rows with only arrival days or no explicit days
          // Also skip unavailable days
          const status = daysWithStatus[rowIndex][dayIndex];
          if ((!isArrivalDay && !isDepartureDay && !hasArrivalOnly && !hasNoExplicitDays) || status?.isUnavailable) {
            return null;
          }

          // Get the column start index for the day
          const columnStart = dayIndex + 1;
          const isSelectingRow = isSelecting && selectedStartDate.rowIndex === rowIndex;

          return (
            <div
              key={`${rowIndex}-${dateString}-${dayIndex}`}
              className={`h-cell-height relative stroke-current fill-day [fill-opacity:0.65]`}
              style={{
                display: 'block',
                gridColumnStart: columnStart,
                gridColumnEnd: columnStart,
                gridRow: rowIndex + 1,
              }}
              onClick={() => handleDayClick(day, rowIndex, columnStart, hasArrivalOnly, hasNoExplicitDays)}
              onMouseEnter={() => handleHover(day, rowIndex, columnStart, hasNoExplicitDays, isArrivalDay)}
              onMouseLeave={handleMouseLeave}
            >
              {
                (!status || !status.isUnavailable) &&
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`${isSelectingRow || isArrivalDay || hasNoExplicitDays? 'cursor-pointer' : ''}  h-full mw-full m-0 p-0 flex text-black`}>
                        {isArrivalDay ? (
                          <ArrivalDayIcon iconFill={iconFillColor} iconStroke={iconFillColor} cellWidth={cellWidth} className={`${isSelectingRow || isDepartureDay ? 'opacity-25' : ''}`} />
                        ) : isDepartureDay ? (
                          <DepartureDayIcon iconFill={iconFillColor} iconStroke={iconFillColor} cellWidth={cellWidth} className={`${!isSelectingRow ? 'opacity-25' : ''}`}/>
                        ) : null}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isArrivalDay ? 'Anreisetag' : isDepartureDay ? 'Abreisetag' : ''}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              }
            </div>
          );
        });
      })}
    </div>
  );
};

export default ArrivalAndDepartureDays;
