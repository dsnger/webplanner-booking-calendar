import { useState, useCallback, useEffect, RefObject } from 'react';
import { BookingObject, CellCoordinates } from "../types";
import { formatDate } from "../utils/dateUtils";
import { useBookingObjects } from "../provider/BookingObjectsContext";

export const useCellSelection = (bookingCalendarWrapperRef: RefObject<HTMLDivElement>) => {
  const [selectedDayStart, setSelectedDayStart] = useState<Date | null>(null);
  const [selectedDayEnd, setSelectedDayEnd] = useState<Date | null>(null);
  const [selectedCell, setSelectedCell] = useState<CellCoordinates | null>(null);
  const [secondSelectedCell, setSecondSelectedCell] = useState<CellCoordinates | null>(null);
  const [cellClasses, setCellClasses] = useState<{ rowIndex: number; colIndex: number; classes: string[] }[]>([]);
  const { bookingObjects } = useBookingObjects();


  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Check if the click is outside of the table body
      if (bookingCalendarWrapperRef.current && !bookingCalendarWrapperRef.current.contains(event.target as Node)) {
        setSelectedCell(null);
        setSecondSelectedCell(null);
        setSelectedDayStart(null);
        setSelectedDayEnd(null);
        setCellClasses([]);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);



  const handleCellSelection = useCallback((clickedDate: Date, rowIndex: number, colIndex: number) => {
    
    const clickedDateString = formatDate(clickedDate);
      //zweite Auswahl, aber andere Zeile
      if (selectedCell && secondSelectedCell || rowIndex !== selectedCell?.rowIndex) {
        setSelectedCell({ rowIndex, colIndex });
        setSecondSelectedCell(null);
        setCellClasses([{ rowIndex, colIndex, classes: ['is-selected'] }]);
        setSelectedDayStart(clickedDate);
        setSelectedDayEnd(null);
     
        console.log('start new ' + clickedDateString)
  
        //Second day range: same row, other col
      } else if (selectedCell && (rowIndex === selectedCell.rowIndex) && (colIndex !== selectedCell.colIndex) ) {
        setSecondSelectedCell({ rowIndex, colIndex });
        setCellClasses([{ rowIndex, colIndex, classes: ['is-selected'] }]);
        setHighlightedRange(selectedCell.rowIndex, selectedCell.colIndex, colIndex);
        setSelectedDayEnd(clickedDate);
       
        console.log('second ' + clickedDateString)
        if (selectedDayStart != null && clickedDate < selectedDayStart) {
          setSelectedDayEnd(selectedDayStart);
          setSelectedDayStart(clickedDate);
          sendDateSelection(rowIndex,clickedDate, selectedDayStart)
        } else {
          sendDateSelection(rowIndex, selectedDayStart, clickedDate)
        }

        //gleiche Zeile, gleicher Tag
      } else if (selectedCell && (rowIndex === selectedCell.rowIndex) && (colIndex === selectedCell.colIndex) ) {
        //same day twice click
        setSecondSelectedCell({ rowIndex, colIndex });
        setSelectedDayEnd(clickedDate);
        console.log('same twice ' + clickedDateString)

        sendDateSelection(rowIndex, clickedDate, selectedDayStart)
       
      } else if ((selectedCell === null && secondSelectedCell === null) || secondSelectedCell !== null) {
        setSelectedCell({ rowIndex, colIndex });
        setCellClasses([{ rowIndex, colIndex, classes: ['is-selected'] }]);
        setSelectedDayStart(clickedDate);
        setSelectedDayEnd(null);

        console.log('first ' + clickedDateString)
      }
    
    
  }, [selectedCell, secondSelectedCell, cellClasses]); 
  


  // const alertSelection = (startDay: Date | null, endDay: Date | null = null) => {
  //   setTimeout(() => {
  //   const startDateString = startDay ? formatDate(startDay) : null;
  //   const endDateString = endDay != null ? formatDate(endDay) : null;
  //   if (startDay === endDay) {
  //     alert(`Selected date: ${startDateString}`);
  //   } else {
  //     alert(`Selected date range: ${startDateString} to ${endDateString}`);
  //   }
  // }, 200); 
  // }


  const sendDateSelection = async (objId: number, startDay: Date | null, endDay: Date | null = null) => {
    // Format your dates as needed
    
    const startDateString = startDay ? formatDate(startDay) : null;
    const endDateString = endDay != null ? formatDate(endDay) : null;
    const baseUrl = bookingObjects[objId].bookingLink;
  
    // Construct the URL with query parameters
    //const url = `mailer.php?lang=de&fewoOwnID=10745&boatID=22894&f=&perioden=3&startDate=${startDateString}&endDate=${endDateString}`;
  
    const url = `${baseUrl}&startDate=${startDateString}&endDate=${endDateString}`;
    window.open(url, '_blank', 'width=785,height=720');
   
  };


  const setHighlightedRange = (rowIndex: number, colIndex1: number, colIndex2: number): void => {
    const startColIndex = Math.min(colIndex1, colIndex2);
    const endColIndex = Math.max(colIndex1, colIndex2);

    console.log(startColIndex + " " + endColIndex);

    const newCellClasses = [...cellClasses];

    for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
      const cellEntryIndex = newCellClasses.findIndex(entry => entry.rowIndex === rowIndex && entry.colIndex === colIndex);

      if (cellEntryIndex !== -1) {
        newCellClasses[cellEntryIndex].classes = ['is-selected'];
      } else {
        newCellClasses.push({ rowIndex, colIndex, classes: ['is-selected'] });
      }
    }
    setCellClasses(newCellClasses);
  };


  // const areUnavailableDaysBetween = (start: Date, end: Date, rowIndex: number): boolean => {
  //   // Ensure start is always before or equal to end
  //   const actualStart = isBefore(start, end) ? start : end;
  //   const actualEnd = isBefore(start, end) ? end : start;

  //   return bookingObjects[rowIndex].blockedDateRanges.some(range => {

  //     const rangeStart = parseISO(range.start);
  //     const rangeEnd = parseISO(range.end);

  //     // Check if any day in the range of actualStart to actualEnd is within an unavailable date range
  //     return isWithinInterval(actualStart, { start: rangeStart, end: rangeEnd }) ||
  //       isWithinInterval(actualEnd, { start: rangeStart, end: rangeEnd }) ||
  //       (actualStart < rangeStart && actualEnd > rangeEnd) ||
  //       (actualStart > rangeStart && actualEnd < rangeEnd);
  //   });
  // };


  


  return {
    selectedCell,
    secondSelectedCell,
    cellClasses,
    handleCellSelection,
  };
};
