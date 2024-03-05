import { useState, useCallback, useEffect, RefObject, useRef } from 'react';
import { CellCoordinates, DayStatus } from "../types";
import { formatDate } from "../utils/dateUtils";
import { useBookingObjects } from "../context/BookingObjectsContext";
import { endOfDay, isBefore } from "date-fns";

export const useCellSelection = (bookingCalendarWrapperRef: RefObject<HTMLDivElement>, daysWithStatus: DayStatus[][]) => {
  const [selectedDayStart, setSelectedDayStart] = useState<Date | null>(null);
  const [selectedDayEnd, setSelectedDayEnd] = useState<Date | null>(null);
  const [selectedCell, setSelectedCell] = useState<CellCoordinates | null>(null);
  const [secondSelectedCell, setSecondSelectedCell] = useState<CellCoordinates | null>(null);
  const [cellClasses, setCellClasses] = useState<{ rowIndex: number; colIndex: number; classes: string[] }[]>([]);
  // const [hoveredCell, setHoveredCell] = useState<CellCoordinates | null>(null);

  const { bookingObjects } = useBookingObjects();

  // Use useRef to keep a reference to the opened window
  const openedWindowRef = useRef<Window | null>(null);


  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (bookingCalendarWrapperRef.current && !bookingCalendarWrapperRef.current.contains(event.target as Node)) {
        setSelectedCell(null);
        setSecondSelectedCell(null);
        setSelectedDayStart(null);
        setSelectedDayEnd(null);
        setCellClasses([]);
        // setHoveredCell(null);
      }
    };

    // Attach the mousedown listener to the whole document
    document.addEventListener('mousedown', handleOutsideClick);

    // Cleanup function to remove both event listeners
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);



  const handleCellSelection = useCallback((clickedDate: Date, rowIndex: number, colIndex: number) => {
    
    if (!isSelectable(clickedDate, rowIndex, colIndex)) {
      return false;
    } 
    
    const clickedDateString = formatDate(clickedDate);
      
      //selection done or click in a different row
    if (selectedCell && secondSelectedCell || rowIndex !== selectedCell?.rowIndex) {
        
        //if first selection is departure return null
        if (isDepartureDay(rowIndex, colIndex) || (isOnlyDepartureDay(rowIndex, colIndex) && !isArrivalDay(rowIndex, colIndex))) return null;
      
        setSelectedCell({ rowIndex, colIndex });
        setSecondSelectedCell(null);
        setCellClasses([{ rowIndex, colIndex, classes: ['is-selected','is-start'] }]);
        setSelectedDayStart(clickedDate);
        setSelectedDayEnd(null);
        console.log('start new ' + clickedDateString)

  
      //Second selection of range: same row, other col
      } else if (selectedCell && (rowIndex === selectedCell.rowIndex) && (colIndex !== selectedCell.colIndex)) {
        
        if (areUnavailableDaysInRange(selectedCell.colIndex, colIndex, rowIndex) === true) {
          setSelectedCell({ rowIndex, colIndex });
          setSecondSelectedCell(null);
          setCellClasses([{ rowIndex, colIndex, classes: ['is-selected','is-start'] }]);
          setSelectedDayStart(clickedDate);
          setSelectedDayEnd(null);

        } else {
               
          //if second selection is arrival
          if (isArrivalDay(rowIndex, colIndex)) return null;

          if (selectedDayStart != null && clickedDate > selectedDayStart) {
            setSecondSelectedCell({ rowIndex, colIndex });
            setCellClasses([{ rowIndex, colIndex, classes: ['is-selected','is-end'] }]);
            setSelectedDayEnd(clickedDate);
            setHighlightedRange(selectedCell.rowIndex, selectedCell.colIndex, colIndex);
          }

          //console.log('second ' + clickedDateString)
        
          if (selectedDayStart != null && clickedDate < selectedDayStart) {

            if (isDepartureDay(rowIndex, colIndex) && !isOnlyDepartureDay(rowIndex, colIndex)) {
              return false;
            }
            setSecondSelectedCell({ rowIndex, colIndex });
            // setCellClasses([{ rowIndex, colIndex, classes: ['is-selected', 'is-start'] }]);
            setHighlightedRange(selectedCell.rowIndex, selectedCell.colIndex, colIndex);
            setSelectedDayEnd(selectedDayStart);
            setSelectedDayStart(clickedDate);
            sendDateSelection(rowIndex, clickedDate, selectedDayStart)
            
          } else {
            sendDateSelection(rowIndex, selectedDayStart, clickedDate)
          }

        }
        
      //gleiche Zeile, gleicher Tag
      } else if (selectedCell && (rowIndex === selectedCell.rowIndex) && (colIndex === selectedCell.colIndex) ) {
        //same day twice click
        setSecondSelectedCell({ rowIndex, colIndex });
        setSelectedDayEnd(clickedDate);
        console.log('same twice ' + clickedDateString)
        sendDateSelection(rowIndex, selectedDayEnd, selectedDayStart)
       
      //first selection
    } else if ((selectedCell === null && secondSelectedCell === null) || secondSelectedCell !== null) {
      
        //if first selection is departure return null
        if (isDepartureDay(rowIndex, colIndex) && !isOnlyDepartureDay(rowIndex, colIndex)) return null;
      
        setSelectedCell({ rowIndex, colIndex });
        setCellClasses([{ rowIndex, colIndex, classes: ['is-selected','is-start'] }]);
        setSelectedDayStart(clickedDate);
        setSelectedDayEnd(null);
        console.log('first ' + clickedDateString)
      }


  }, [selectedCell, secondSelectedCell, cellClasses]); 
  


  const sendDateSelection = async (objId: number, startDay: Date | null, endDay: Date | null = null) => {
    //Format your dates as needed
    const startDateString = startDay ? formatDate(startDay) : null;
    const endDateString = endDay != null ? formatDate(endDay) : null;
    const baseUrl = bookingObjects[objId].bookingLink;
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


  const areUnavailableDaysInRange = ( startColIndex: number, endColIndex: number, rowIndex: number): boolean => {
    
    const colIndexStart = Math.min(startColIndex, endColIndex);
    const colIndexEnd =  Math.max(startColIndex, endColIndex);

    for (let colIndex = colIndexStart; colIndex <= colIndexEnd; colIndex++) {
      // Check if the day exists and has a status of 'unavailable'
      const day = daysWithStatus[rowIndex]?.[colIndex];
      if (day && day.isUnavailable === true) {
        console.log('Unavailable day found at row:', rowIndex, 'col:', colIndex);
        return true; // Found an unavailable day, return true
      }
    }
    return false;
  };


  const isSelectable = (clickedDate: Date, rowIndex: number, colIndex: number) => {
      
    //if is in past
    if (isBefore(endOfDay(clickedDate), new Date())) return false;
    
    //is unavailable
    const day = daysWithStatus[rowIndex]?.[colIndex];
    if (day && day.isUnavailable === true) { 
      return false;
    }

    if (day && (day.isDisabled === true && day.isArrival === false && day.isDeparture === false)) { 
      return false;
    }
    
    return true;
  }
  

  const isArrivalDay = (rowIndex: number, colIndex: number) => {
    const day = daysWithStatus[rowIndex]?.[colIndex];
    if (day && day.isArrival === true) { 
      return true;
    }
    return false;
  }
  


   const isOnlyDepartureDay = (rowIndex: number, colIndex: number) => {
    const day = daysWithStatus[rowIndex]?.[colIndex];
    if (day && day.isOnlyDeparture === true) { 
      return true;
    }
    return false;
   }

  
   const isDepartureDay = (rowIndex: number, colIndex: number) => {
    const day = daysWithStatus[rowIndex]?.[colIndex];
    if (day && day.isDeparture === true) { 
      return true;
    }
    return false;
   }

  
   const setHighlightedRange = (rowIndex: number, colIndex1: number, colIndex2: number): void => {
  const startColIndex = Math.min(colIndex1, colIndex2);
  const endColIndex = Math.max(colIndex1, colIndex2);

  console.log(startColIndex + " " + endColIndex);
  const newCellClasses = [...cellClasses];

  for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
    const cellEntryIndex = newCellClasses.findIndex(entry => entry.rowIndex === rowIndex && entry.colIndex === colIndex);

    // Determine the classes based on the position
    let classesToAdd = ['is-selected'];
    if (colIndex === startColIndex) {
      classesToAdd.push('is-start');
    }
    if (colIndex === endColIndex) {
      classesToAdd.push('is-end');
    }

    if (cellEntryIndex !== -1) {
      // If the cell entry exists, update its classes
      newCellClasses[cellEntryIndex].classes = classesToAdd;
    } else {
      // If the cell entry doesn't exist, create a new one with the appropriate classes
      newCellClasses.push({ rowIndex, colIndex, classes: classesToAdd });
    }
  }

  setCellClasses(newCellClasses);
};



  return {
    selectedCell,
    secondSelectedCell,
    cellClasses,
    handleCellSelection,
  };
};
