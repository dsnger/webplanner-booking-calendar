import { useRef } from "react";
import { BookingObject, DayStatus } from "../types";
import { isSameDay } from "date-fns";
import BookingCalendarCell from "./BookingCalendarCell";
import { useCellSelection } from "../hooks/useCellSelection";


// Props type definition
interface TableBodyProps {
  bookingObjects: BookingObject[];
  days: Date[];
  daysWithStatus: DayStatus[][],
  currentDate: Date;
}


const BookingCalenderTableBody: React.FC<TableBodyProps> = ({
  bookingObjects,
  days,
  daysWithStatus,
  currentDate,
  }) => {
  
  // const { handleDateSelection } = useDateSelection();
  const { selectedCell, secondSelectedCell, cellClasses, handleCellSelection } = useCellSelection();
  // const { setHighlightedRange, handleCellHover } = useCellHighlighting();
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  // const blockedRangeDatesLookup: { [key: string]: BlockedDateRangeInfo[] } = {};

  // // Convert start and end dates to Date objects once
  // bookingObjects.forEach(bookingObject => {

  //   const blockedRanges = bookingObject.blockedDateRanges || [];

  //   blockedRangeDatesLookup[bookingObject.objId] = blockedRanges.map(range => ({
  //     ...range,
  //     start: parseISO(range.start),
  //     end: parseISO(range.end),
  //     endhalf: range.endhalf,
  //     starthalf: range.starthalf,
  //     type: range.type as DateRangeType,
  //     tooltip: range.tooltip,
  //   }));
  // });


  // const isBlockedDateRange = (date: Date, objId: string): { isUnavailable: boolean; type: DateRangeType | null; tooltip: string | null, isUnavailStart: boolean, isUnavailEnd: boolean} => {
  //   let isUnavailStart = false;
  //   let isUnavailEnd = false;
  //   let isUnavailable = false;
  
  //   const range = blockedRangeDatesLookup[objId]?.find(range => {
  //     const startDay = range.start;
  //     const endDay = range.end;
  //     // Assuming starthalf and endhalf are meant for half-day bookings and not used for full-day availability checks
  
  //     if (isSameDay(date, startDay)) {
  //       isUnavailStart = true;
  //       return true; // Date matches the start of a range
  //     }
  
  //     if (isSameDay(date, endDay)) {
  //       isUnavailEnd = true;
  //       return true; // Date matches the end of a range
  //     }
  
  //     if (isWithinInterval(date, { start: startDay, end: endDay })) {
  //       isUnavailable = true;
  //       return true; // Date is within the range
  //     }
  //   });
  
  //   return {
  //     isUnavailable,
  //     type: range?.type || null,
  //     tooltip: range?.tooltip || null,
  //     isUnavailStart,
  //     isUnavailEnd,
  //   };
  // };


  // const isDateType = (date: Date, objId: string, type: 'arrival' | 'departure'): boolean => {
  //   const bookingObject = bookingObjects.find(obj => obj.objId === objId);
  
  //   if (!bookingObject) {
  //     return false;
  //   }
  
  //   // Using a fallback to an empty array if dateStrings are undefined
  //   const dateStrings = type === 'arrival'
  //     ? bookingObject.dayTypes.arrivalDays.dates || []
  //     : bookingObject.dayTypes.departureDays.dates || [];
  
  //   return dateStrings.some(dateString => isSameDay(date, parseISO(dateString)));
  // };



  return (
    <tbody ref={tableBodyRef}>
      {bookingObjects.map((bookingObject, rowIndex) => (
        <tr key={rowIndex}>
          {days.map((date, colIndex) => {

            // const { isUnavailable, type, tooltip, isUnavailStart, isUnavailEnd } = isBlockedDateRange(date, bookingObject.objId);
            // const isArrival = isDateType(date, bookingObject.objId, 'arrival');
            // const isDeparture = isDateType(date, bookingObject.objId, 'departure');
            const selectClasses = cellClasses.find(entry => entry.rowIndex === rowIndex && entry.colIndex === colIndex)?.classes?.join(' ') || ''
            
            // Directly access the corresponding day status using rowIndex and colIndex
            const dayStatus = daysWithStatus[rowIndex]?.[colIndex] || {};

            // Destructure the needed properties, providing default values
            const { isUnavailable = false, type = null, isUnavailStart = false, isUnavailEnd = false, isArrival = false, isDeparture = false } = dayStatus;

            
            return (
              <BookingCalendarCell
                key={`${rowIndex}-${colIndex}`}
                objId={bookingObject.objId}
                date={date}
                isSelected={(selectedCell?.rowIndex === rowIndex && selectedCell?.colIndex === colIndex) || secondSelectedCell?.rowIndex === rowIndex && secondSelectedCell?.colIndex === colIndex}
                selectClasses={selectClasses}
                content={``}
                tooltip={''}
                onClick={() => handleCellSelection(rowIndex, colIndex, false)}
                // onClick={() => alert(rowIndex + colIndex)}
              
                statusFlags={{
                  isToday: isSameDay(date, currentDate),
                  isUnavailable,
                  type,
                  isUnavailStart,
                  isUnavailEnd,
                  isArrival,
                  isDeparture,
                }}
              />
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};

export default BookingCalenderTableBody;
