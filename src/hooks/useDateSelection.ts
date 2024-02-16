import { useState, useCallback } from 'react';
import { CellCoordinates } from "../types";
import { isBefore, isWithinInterval, parseISO } from "date-fns";
import { useBookingObjects } from "../provider/BookingObjectsContext";

export const useDateSelection = () => {
  const [selectedDayStart, setSelectedDayStart] = useState<Date | null>(null);
  const [selectedDayEnd, setSelectedDayEnd] = useState<Date | null>(null);
  const [selectedCell, setSelectedCell] = useState<CellCoordinates | null>(null);
  const { bookingObjects } = useBookingObjects();

  const areUnavailableDaysBetween = (start: Date, end: Date, rowIndex: number): boolean => {
    // Ensure start is always before or equal to end
    const actualStart = isBefore(start, end) ? start : end;
    const actualEnd = isBefore(start, end) ? end : start;

    return bookingObjects[rowIndex].blockedDateRanges.some(range => {

      const rangeStart = parseISO(range.start);
      const rangeEnd = parseISO(range.end);

      // Check if any day in the range of actualStart to actualEnd is within an unavailable date range
      return isWithinInterval(actualStart, { start: rangeStart, end: rangeEnd }) ||
        isWithinInterval(actualEnd, { start: rangeStart, end: rangeEnd }) ||
        (actualStart < rangeStart && actualEnd > rangeEnd) ||
        (actualStart > rangeStart && actualEnd < rangeEnd);
    });
  };


  const handleDateSelection = useCallback((clickedDate: Date, rowIndex: number, colIndex: number) => {
      // Date selection logic
      if (selectedDayStart === null || (selectedDayStart !== null && selectedDayEnd !== null)) {
  
        setSelectedDayStart(clickedDate);
        setSelectedDayEnd(null);
        setSelectedCell({ rowIndex, colIndex });
        // setSecondSelectedCell(null);
        // setCellClasses([]);
  
      } else if (selectedDayStart !== null && selectedDayEnd === null) {
  
        const unavailableDaysBetween = areUnavailableDaysBetween(selectedDayStart, clickedDate, rowIndex);
  
        if (unavailableDaysBetween) {
          console.log('jjaaaa')
          setSelectedDayStart(clickedDate);
          setSelectedDayEnd(null);
          setSelectedCell({ rowIndex, colIndex });
  
          // Cell selection logic (if needed separately)
          //handleCellSelection(rowIndex, colIndex, unavailableDaysBetween);
  
        } else {
          setSelectedDayEnd(clickedDate);
          //change the order of the dates if the end date is before the start date
          if (clickedDate < selectedDayStart) {
            setSelectedDayEnd(selectedDayStart);
            setSelectedDayStart(clickedDate);
          }
          // setSecondSelectedCell({ rowIndex, colIndex });
          // if (selectedCell) {
          //   //setHighlightedRange(selectedCell.rowIndex, selectedCell.colIndex, colIndex);
          // }
          // Cell selection logic (if needed separately)
          //handleCellSelection(rowIndex, colIndex, false);
        }
      }
  
  }, []); // Add dependencies if any

  return {
    selectedDayStart,
    selectedDayEnd,
    selectedCell,
    handleDateSelection,
  };
};
