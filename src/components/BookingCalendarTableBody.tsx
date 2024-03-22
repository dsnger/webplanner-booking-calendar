import React, { RefObject, useRef } from "react";
import { BookingObject, CellCoordinates, DayStatus } from "../types";
import { endOfDay, isBefore, isSameDay } from "date-fns";
import BookingCalendarCell from "./BookingCalendarCell";
import { useCellSelection } from "../hooks/useCellSelection";
import { useCellHighlighting } from "../hooks/useCellHighlight";


// Props type definition
interface TableBodyProps {
  bookingObjects: BookingObject[];
  days: Date[];
  daysWithStatus: DayStatus[][],
  currentDate: Date;
  bookingCalendarWrapperRef: RefObject<HTMLDivElement>
}


const BookingCalenderTableBody: React.FC<TableBodyProps> = ({
  bookingObjects,
  days,
  daysWithStatus,
  currentDate,
  bookingCalendarWrapperRef
  }) => {
  
  const { isCellInRange, handleCellHover} = useCellHighlighting(bookingCalendarWrapperRef);
  const { selectedCell, secondSelectedCell, cellClasses, handleCellSelection } = useCellSelection(bookingCalendarWrapperRef,daysWithStatus);
 
  const tableBodyRef = useRef<HTMLDivElement>(null);
  const cellRowCount = days.length;

  return (
  
    <div  ref={tableBodyRef}>
      {bookingObjects.map((bookingObject, rowIndex) => (
        <div key={rowIndex} className="grid border-b-4 border-white"
          style={{ 
          width: `calc(${cellRowCount} * var(--cell-width))`, 
          gridTemplateColumns: `repeat(${cellRowCount}, 2fr)`,
          gridTemplateRows: 'auto auto',
        }}>
          {days.map((date, colIndex) => {

            const selectClasses = cellClasses.find(entry => entry.rowIndex === rowIndex && entry.colIndex === colIndex)?.classes?.join(' ') || '';
            //const hlClasses = cellHlClasses.find(entry => entry.rowIndex === rowIndex && entry.colIndex === colIndex)?.classes?.join(' ') || '';
            // Directly access the corresponding day status using rowIndex and colIndex
            const dayStatus = daysWithStatus[rowIndex]?.[colIndex] || {};
            // Destructure the needed properties, providing default values
            const { isUnavailable = false, type = null, isUnavailStart = false, isUnavailEnd = false, isUnavailStartHalf = false, isUnavailEndHalf = false, isDisabled = false, isArrival = false, isDeparture = false } = dayStatus;
            const isHoveredCell = isCellInRange(rowIndex, colIndex, selectedCell, secondSelectedCell, !isUnavailable)
            const isInPast = isBefore(endOfDay(date), new Date());
            const isSelectedCell = (rowIndex: number, colIndex : number, selectedCell: CellCoordinates, secondSelectedCell: CellCoordinates) => (
              (selectedCell && secondSelectedCell && 
                ((rowIndex >= Math.min(selectedCell.rowIndex, secondSelectedCell.rowIndex) && rowIndex <= Math.max(selectedCell.rowIndex, secondSelectedCell.rowIndex)) &&
                (colIndex >= Math.min(selectedCell.colIndex, secondSelectedCell.colIndex) && colIndex <= Math.max(selectedCell.colIndex, secondSelectedCell.colIndex)))
              ) || 
              (selectedCell?.rowIndex === rowIndex && selectedCell?.colIndex === colIndex) || 
              (secondSelectedCell?.rowIndex === rowIndex && secondSelectedCell?.colIndex === colIndex)
            );
            

            return (
              <BookingCalendarCell
                key={`${rowIndex}-${colIndex}`}
                objId={bookingObject.objId}
                date={date}
                isSelected={isSelectedCell(rowIndex, colIndex, selectedCell, secondSelectedCell)}
                selectClasses={`${selectClasses} `}
                content={``}
                tooltip={''}
                onClick={() => handleCellSelection(date, rowIndex, colIndex)}
                onMouseEnter={() => handleCellHover(rowIndex, colIndex, selectedCell, secondSelectedCell, !isUnavailable)}
                
                statusFlags={{
                  isToday: isSameDay(date, currentDate),
                  isUnavailable,
                  type,
                  isUnavailStart,
                  isUnavailEnd,
                  isUnavailStartHalf,
                  isUnavailEndHalf,
                  isDisabled,
                  isArrival,
                  isDeparture,
                  isHoveredCell,
                  isInPast
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default BookingCalenderTableBody;
