import { differenceInCalendarDays } from "date-fns";
import ArrivalDayIcon from "./icons/ArrivalDayIcon";
import { useSettings } from "@/hooks/useSettings";
import { useDays } from "@/hooks/useDays";
import { useBookingObjects } from "@/hooks/useBookingObjects";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";



const ArrivalDays: React.FC = () => {

  const { bookingObjects } = useBookingObjects();
  const { days, daysWithStatus } = useDays();
  const cellColCount = days.length;

  const { calendarSettings} = useSettings();
  const cellWidth = parseFloat(calendarSettings[0].cellSettings.cellWidth);
  const iconFillColor = calendarSettings[0].colorSettings.available;

  if (!Array.isArray(bookingObjects)) {
    console.error('bookingObjects is not an array:', bookingObjects);
    return <div>Invalid booking data</div>;
  }

  return (
      <div className="grid pointer-events-none z-10 "
        style={{
          width: `calc(${cellColCount} * (var(--cell-width) + var(--cell-gap))`,
          gridTemplateColumns: `repeat(${cellColCount}, 1fr)`,
          gridTemplateRows: `repeat(${bookingObjects.length}, var(--cell-height))`,
          rowGap: `var(--cell-gap)`,
        }}>

        {bookingObjects.map((bookingObject, rowIndex) => {
        if (!bookingObject || !Array.isArray(bookingObject.dayTypes.arrivalDays.dates)) {
          return null;
        }

        return bookingObject.dayTypes.arrivalDays.dates.map((arrivalDaysDateString,arrivalDaysIndex) => {
          if (!arrivalDaysDateString) {
            return null;
          }

          // Convert the date string to a Date object
          const date = new Date(arrivalDaysDateString);

          const getColumnStart = (date: Date) => days.findIndex(day => differenceInCalendarDays(day, date) === 0) + 1;
          const columnStart = getColumnStart(date);

          // Find the index of the date in the days array
          const dayIndex = days.findIndex(day => differenceInCalendarDays(day, date) === 0);
          const status = dayIndex !== -1 ? daysWithStatus[rowIndex][dayIndex] : null;

          return (
            <div
              key={`${rowIndex}-${arrivalDaysIndex}`}
              className={`h-cell-height relative stroke-current pointer-events-auto cursor-pointer text-day-arrival fill-day-arrival [fill-opacity:0.65]`}
              style={{
              display: 'block',
              gridColumnStart: columnStart,
              gridColumnEnd: columnStart,
              gridRow: rowIndex + 1,
            }}
            >
              {
                !status || !status?.isUnavailable &&
                <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ArrivalDayIcon iconFill={iconFillColor} iconStroke={iconFillColor} cellWidth={cellWidth} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{'Anreisetag'}</p>
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

export default ArrivalDays;
