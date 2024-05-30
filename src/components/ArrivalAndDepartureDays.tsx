import React from 'react';
import { differenceInCalendarDays } from "date-fns";
import ArrivalDayIcon from "./icons/ArrivalDayIcon";
import DepartureDayIcon from "./icons/DepartureDayIcon"; // Assuming you have a separate icon for departure days
import { useSettings } from "@/hooks/useSettings";
import { useDays } from "@/hooks/useDays";
import { useBookingObjects } from "@/hooks/useBookingObjects";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

// Define the types for the day types and booking objects
interface DayTypes {
  arrivalDays: {
    dates: string[];
  };
  departureDays: {
    dates: string[];
  };
}


const ArrivalAndDepartureDays: React.FC = () => {
  const { bookingObjects } = useBookingObjects();
  const { days, daysWithStatus } = useDays();
  const cellColCount = days.length;

  const { calendarSettings } = useSettings();
  const cellWidth = parseFloat(calendarSettings[0].cellSettings.cellWidth);
  const iconFillColor = calendarSettings[0].colorSettings.available;

  if (!Array.isArray(bookingObjects)) {
    console.error('bookingObjects is not an array:', bookingObjects);
    return <div>Invalid booking data</div>;
  }

  return (
    <div className="grid z-20 relative"
      style={{
        width: `calc(${cellColCount} * (var(--cell-width) + var(--cell-gap))`,
        gridTemplateColumns: `repeat(${cellColCount}, 1fr)`,
        gridTemplateRows: `repeat(${bookingObjects.length}, var(--cell-height))`,
        rowGap: `var(--cell-gap)`,
      }}>
      {bookingObjects.map((bookingObject, rowIndex) => {
        const dayTypes: (keyof DayTypes)[] = ['arrivalDays', 'departureDays'];

        return dayTypes.flatMap((dayTypeKey) => {
          const dayTypeDates = bookingObject.dayTypes[dayTypeKey]?.dates;

          if (!Array.isArray(dayTypeDates)) {
            return [];
          }

          return dayTypeDates.map((dateString, dateIndex) => {
            if (!dateString) {
              return null;
            }

            // Convert the date string to a Date object
            const date = new Date(dateString);

            const getColumnStart = (date: Date) => days.findIndex(day => differenceInCalendarDays(day, date) === 0) + 1;
            const columnStart = getColumnStart(date);

            // Find the index of the date in the days array
            const dayIndex = days.findIndex(day => differenceInCalendarDays(day, date) === 0);
            const status = dayIndex !== -1 ? daysWithStatus[rowIndex][dayIndex] : null;

            return (
              <div
                key={`${rowIndex}-${dayTypeKey}-${dateIndex}`}
                className={`h-cell-height relative stroke-current cursor-pointer fill-day-${dayTypeKey.slice(0, -4)} [fill-opacity:0.65]`}
                style={{
                  display: 'block',
                  gridColumnStart: columnStart,
                  gridColumnEnd: columnStart,
                  gridRow: rowIndex + 1,
                }}>
                {
                  !status || !status.isUnavailable &&
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="h-full mw-full m-0 p-0 flex text-black">
                          {dayTypeKey === 'arrivalDays' ? (
                            <ArrivalDayIcon iconFill={iconFillColor} iconStroke={iconFillColor} cellWidth={cellWidth} />
                          ) : (
                            <DepartureDayIcon iconFill={iconFillColor} iconStroke={iconFillColor} cellWidth={cellWidth} />
                              )}
                          </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{dayTypeKey === 'arrivalDays' ? 'Anreisetag' : 'Abreisetag'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                }
              </div>
            );
          });
        });
      })}
    </div>
  );
};

export default ArrivalAndDepartureDays;
