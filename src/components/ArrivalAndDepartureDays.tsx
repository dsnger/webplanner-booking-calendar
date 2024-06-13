import { useBookingObjects } from "@/hooks/useBookingObjects";
import { useDays } from "@/hooks/useDays";
import { useSelectedDates } from "@/hooks/useSelectedDates";
import { useState } from "react";
import DynamicRange from "./DynamicRange";
import DayContent from "./DayContent";
import RangeMarkerSVG from "./RangeMarkerSVG";
import { DayStatus } from "@/types";

const ArrivalAndDepartureDays: React.FC = () => {
  const { bookingObjects } = useBookingObjects();
  const { days, daysWithStatus } = useDays();
  const { startSelection, finalizeSelection, selectedStartDate, isSelecting, finalizedSelection } = useSelectedDates();

  // Local state for hover
  const [hoveredDay, setHoveredDay] = useState<{ date: Date, rowIndex: number, columnIndex: number } | null>(null);
  const cellColCount = days.length;

  if (!Array.isArray(bookingObjects)) {
    console.error('bookingObjects is not an array:', bookingObjects);
    return <div>Invalid booking data</div>;
  }

  const handleDayClick = (date: Date, rowIndex: number, columnIndex: number, hasArrivalOnly: boolean, hasNoExplicitDays: boolean, status: DayStatus) => {
    if (hasNoExplicitDays) {
      if (!isSelecting && !status.isUnavailStartHalf ) {
        startSelection(date, rowIndex, columnIndex);
      } else {
        finalizeSelection(date, rowIndex, columnIndex);
      }

    } else if(hasArrivalOnly){
      if (!isSelecting && status.isArrival) {
        startSelection(date, rowIndex, columnIndex);
      } else {
        finalizeSelection(date, rowIndex, columnIndex);
      }

    } else {
      if (status.isArrival) {
        startSelection(date, rowIndex, columnIndex);
      } else if ( status.isDeparture ) {
        finalizeSelection(date, rowIndex, columnIndex);
      }
    }
  };


  const handleHover = (date: Date, rowIndex: number, columnIndex: number, hasNoExplicitDays: boolean, status: DayStatus) => {
    if (isSelecting) return null;
    if ((status.isArrival || hasNoExplicitDays) && !status.isUnavailStartHalf) {
      setHoveredDay({ date, rowIndex, columnIndex });
    } else {
      setHoveredDay(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };


  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (hoveredDay !== null) {
    startDate = hoveredDay.date;
    if (hoveredDay.columnIndex !== null ) {
      endDate = days[hoveredDay.columnIndex + 1];
    }
  }


  return (
    <div
      className="grid z-20 relative days"
      style={{
        width: `calc(${cellColCount} * (var(--cell-width) + var(--cell-gap)))`,
        gridTemplateColumns: `repeat(${cellColCount}, 1fr)`,
        gridTemplateRows: `repeat(${bookingObjects.length}, var(--cell-height))`,
        rowGap: `var(--cell-gap)`,
      }}
    >
      <DynamicRange />
      {hoveredDay && startDate && endDate && (!isSelecting || finalizedSelection) && (
        <RangeMarkerSVG
          index={hoveredDay.rowIndex}
          start={startDate}
          end={endDate}
          starthalf={true}
          endhalf={true}
          days={days}
          type="selected"
          isSelecting={isSelecting}
        />
      )}
      {bookingObjects.map((bookingObject, rowIndex) => {
        const arrivalDates = bookingObject.dayTypes?.arrivalDays?.dates || [];
        const departureDates = bookingObject.dayTypes?.departureDays?.dates || [];
        const hasArrivalOnly = arrivalDates.length > 0 && departureDates.length === 0;
        const hasNoExplicitDays = arrivalDates.length === 0 && departureDates.length === 0;

        return days.map((day, dayIndex) => {
          const dateString = day.toISOString().split('T')[0];
          // Skip rendering days that are neither arrival nor departure, except for rows with only arrival days or no explicit days
          // Also skip unavailable days
          const status = daysWithStatus[rowIndex][dayIndex];

          if ((!status.isArrival && !status.isDeparture && !hasArrivalOnly && !hasNoExplicitDays) || status?.isUnavailable) {
            return null;
          }

          // Determine if the row is currently being selected
          const isSelectingRow = isSelecting && selectedStartDate.rowIndex === rowIndex;

          return (
            <DayContent
              key={`${rowIndex}-${dateString}-${dayIndex}`}
              day={day}
              rowIndex={rowIndex}
              columnIndex={dayIndex}
              status={status}
              hasArrivalOnly={hasArrivalOnly}
              hasNoExplicitDays={hasNoExplicitDays}
              isSelectingRow={isSelectingRow}
              handleDayClick={handleDayClick}
              handleHover={handleHover}
              handleMouseLeave={handleMouseLeave}
            />
          );
        });
      })}
    </div>
  );
};

export default ArrivalAndDepartureDays;