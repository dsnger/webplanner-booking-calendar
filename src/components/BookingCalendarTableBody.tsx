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
  
  const { selectedCell, secondSelectedCell, cellClasses, handleCellSelection } = useCellSelection();
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);


  return (
    <tbody ref={tableBodyRef}>
      {bookingObjects.map((bookingObject, rowIndex) => (
        <tr key={rowIndex}>
          {days.map((date, colIndex) => {

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
