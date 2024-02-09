import { useRef } from "react";
import { BookingObject } from "../types";
import { isSameDay } from "date-fns";
import BookingCalendarCell from "./BookingCalendarCell";


// Props type definition
interface TableBodyProps {
  bookingObjects: BookingObject[];
  days: Date[];
  selectedCell: { rowIndex: number; colIndex: number } | null;
  currentDate: Date;
  cellClasses: { rowIndex: number; colIndex: number; classes: string[] }[];
}

const BookingCalenderTableBody: React.FC<TableBodyProps> = ({
  bookingObjects,
  days,
  selectedCell,
  currentDate,
  cellClasses,
 
  }) => {
  
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  return (
    <tbody ref={tableBodyRef}>
      {bookingObjects.map((bookingObject, rowIndex) => (
        <tr key={rowIndex}>
          {days.map((date, colIndex) => 
          
            <BookingCalendarCell
              key={`${rowIndex}-${colIndex}`}
              objId = {bookingObject.objId}
              date={date}
              isSelected={selectedCell?.rowIndex === rowIndex && selectedCell?.colIndex === colIndex}
              isToday={isSameDay(date, currentDate)}
              content={``}
              onClick={() => {/* Handle click event */}}
            />
       
          )}
        </tr>
      ))}
    </tbody>
  );
};

export default BookingCalenderTableBody;
