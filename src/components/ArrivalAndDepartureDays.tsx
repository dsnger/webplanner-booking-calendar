import { useBookingObjects } from "@/hooks/useBookingObjects";
import { useDays } from "@/hooks/useDays";
import { useSelectedDates } from "@/hooks/useSelectedDates";
import { useRef, useState } from "react";
import DynamicRange from "./DynamicRange";
import DayContent from "./DayContent";
import RangeMarkerSVG from "./RangeMarkerSVG";
import { DayStatus } from "@/types";

const ArrivalAndDepartureDays: React.FC = () => {
  const { bookingObjects } = useBookingObjects();
  const { days, daysWithStatus } = useDays();
  const { startSelection, finalizeSelection, selectedStartDate, isSelecting, finalizedSelection } = useSelectedDates();
  const openedWindowRef = useRef<Window | null>(null); // Ref to keep track of the opened window


  // Local state for hover
  const [hoveredDay, setHoveredDay] = useState<{ date: Date, rowIndex: number, columnIndex: number } | null>(null);
  const cellColCount = days.length;


  if (!Array.isArray(bookingObjects)) {
    console.error('bookingObjects is not an array:', bookingObjects);
    return <div>Invalid booking data</div>;
  }



  const handleDayClick = (date: Date, rowIndex: number, columnIndex: number, hasArrivalOnly: boolean, hasNoExplicitDays: boolean, status: DayStatus) => {
    const objId = bookingObjects[rowIndex].objId;

    const openWindow = (startDate: Date, endDate: Date) => {
      const baseUrl = bookingObjects.find(obj => obj.objId === objId)?.bookingLink || '';
      const startDateString = startDate ? startDate.toISOString().split('T')[0] : '';
      const endDateString = endDate ? endDate.toISOString().split('T')[0] : '';
      const url = `${baseUrl}&startDate=${startDateString}&endDate=${endDateString}`;

      setTimeout(() => {
        if (openedWindowRef.current && !openedWindowRef.current.closed) {
          // Window is open, so reuse it by loading the new URL
          openedWindowRef.current.location.href = url;
        } else {
          // Window is not open, so open a new one and assign it to openedWindowRef.current
          openedWindowRef.current = window.open(url, '_blank', 'width=785,height=720');
        }
        // Optional: Bring the reused window to the front
        openedWindowRef.current?.focus();
      }, 1000);
    };

    if (hasNoExplicitDays) {
      if (!isSelecting && !status.isUnavailStartHalf ) {
        startSelection(date, rowIndex, columnIndex);
        // console.log(daysWithStatus[rowIndex][columnIndex])
      } else {
        finalizeSelection(date, rowIndex, columnIndex);
        if (selectedStartDate.date) {
          openWindow(selectedStartDate.date, date);
        }
      }

    } else if(hasArrivalOnly){
      if (!isSelecting && status.isArrival) {
        startSelection(date, rowIndex, columnIndex);
      } else {
        finalizeSelection(date, rowIndex, columnIndex);
        if (selectedStartDate.date) {
          openWindow(selectedStartDate.date, date);
        }
      }

    } else {
      if (status.isArrival) {
        startSelection(date, rowIndex, columnIndex);
      } else if ( status.isDeparture ) {
        finalizeSelection(date, rowIndex, columnIndex);
        if (selectedStartDate.date) {
          openWindow(selectedStartDate.date, date);
        }
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
      className="grid z-20 relative days pointer-events-none"
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
          finalizedSelection={finalizedSelection}
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

          if ((!status.isArrival && !status.isDeparture && !hasArrivalOnly && !hasNoExplicitDays) || status.isUnavailable || status.isBeforeUnavailableStart) {
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