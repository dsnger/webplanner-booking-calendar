import React, { RefObject, useRef } from 'react';
import { BookingObject, CellCoordinates, DayStatus } from '../types';
import { endOfDay, isBefore, isSameDay } from 'date-fns';
import BookingCalendarCell from './BookingCalendarCell';
import { useCellSelection } from '../hooks/useCellSelection';
import { useCellHighlighting } from '../hooks/useCellHighlight';
import BlockedRanges from "./BlockedRanges";

// Props type definition
interface TableBodyProps {
  bookingObjects: BookingObject[];
  days: Date[];
  daysWithStatus: DayStatus[][];
  currentDate: Date;
  bookingCalendarWrapperRef: RefObject<HTMLDivElement>;
}

const BookingCalenderTableBody: React.FC<TableBodyProps> = ({
  bookingObjects,
  days,
  daysWithStatus,
  currentDate,
  bookingCalendarWrapperRef,
}) => {
  const { isCellInRange, handleCellHover } = useCellHighlighting(
    bookingCalendarWrapperRef
  );
  const { selectedCell, secondSelectedCell, cellClasses, handleCellSelection } =
    useCellSelection(bookingCalendarWrapperRef, daysWithStatus);

  const tableBodyRef = useRef<HTMLDivElement>(null);
  const cellColCount = days.length;

  return (
    <div ref={tableBodyRef} className="relative">
      <BlockedRanges bookingObjects={bookingObjects} days={days}/>
      <div>
        {bookingObjects.map((bookingObject, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-[1px]"
            style={{
              width: `calc(${cellColCount} * var(--cell-width))`,
              gridTemplateColumns: `repeat(${cellColCount}, 2fr)`,
              gridTemplateRows: 'auto auto',
            }}
          >
            {days.map((date, cellIndex) => {
              const selectClasses =
                cellClasses
                  .find(
                    (entry) =>
                      entry.rowIndex === rowIndex &&
                      entry.cellIndex === cellIndex
                  )
                  ?.classes?.join(' ') || '';
              // Directly access the corresponding day status using rowIndex and cellIndex
              const dayStatus = daysWithStatus[rowIndex]?.[cellIndex] || {};
              // Destructure the needed properties, providing default values
              const {
                isUnavailable = false,
                type = null,
                isUnavailStart = false,
                isUnavailEnd = false,
                isUnavailStartHalf = false,
                isUnavailEndHalf = false,
                isDisabled = false,
                isArrival = false,
                isDeparture = false,
              } = dayStatus;
              const isHoveredCell = isCellInRange(
                rowIndex,
                cellIndex,
                selectedCell,
                secondSelectedCell,
                !isUnavailable
              );
              const isInPast = isBefore(endOfDay(date), new Date());

              const isSelectedCell = (
                rowIndex: number,
                cellIndex: number,
                selectedCell: CellCoordinates,
                secondSelectedCell: CellCoordinates
              ) =>
                (selectedCell &&
                  secondSelectedCell &&
                  rowIndex >=
                    Math.min(
                      selectedCell.rowIndex,
                      secondSelectedCell.rowIndex
                    ) &&
                  rowIndex <=
                    Math.max(
                      selectedCell.rowIndex,
                      secondSelectedCell.rowIndex
                    ) &&
                  cellIndex >=
                    Math.min(
                      selectedCell.cellIndex,
                      secondSelectedCell.cellIndex
                    ) &&
                  cellIndex <=
                    Math.max(
                      selectedCell.cellIndex,
                      secondSelectedCell.cellIndex
                    )) ||
                (selectedCell?.rowIndex === rowIndex &&
                  selectedCell?.cellIndex === cellIndex) ||
                (secondSelectedCell?.rowIndex === rowIndex &&
                  secondSelectedCell?.cellIndex === cellIndex);

              return (
                <BookingCalendarCell
                  key={`${rowIndex}-${cellIndex}`}
                  objId={bookingObject.objId}
                  date={date}
                  isSelected={isSelectedCell(
                    rowIndex,
                    cellIndex,
                    selectedCell,
                    secondSelectedCell
                  )}
                  selectClasses={`${selectClasses} `}
                  content={``}
                  tooltip={''}
                  onClick={() => handleCellSelection(date, rowIndex, cellIndex)}
                  onMouseEnter={() =>
                    handleCellHover(
                      rowIndex,
                      cellIndex,
                      selectedCell,
                      secondSelectedCell,
                      !isUnavailable
                    )
                  }
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
                    isInPast,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingCalenderTableBody;
