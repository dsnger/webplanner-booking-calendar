import React, { useState, useMemo, useEffect, useRef } from 'react';
import { isSameDay, startOfDay, endOfMonth, eachDayOfInterval, getDay, getMonth, format, startOfYear, endOfYear, isWithinInterval, parseISO, isBefore } from 'date-fns';
import { getMonthName, getDayName, formatDate } from "../utils";
import { BookingObject, BlockedDateRangeInfo } from "../types";
import Legend from "./Legend";

type CellCoordinates = { rowIndex: number; colIndex: number } | null;

interface TableWithDateRangeProps {
  year: number;
  bookingObjects: BookingObject[];
}

const TableWithDateRange: React.FC<TableWithDateRangeProps> = ({ year, bookingObjects }): JSX.Element => {
  const [unavailableCells, setUnavailableCells] = useState<{rowIndex: number, colIndex: number}[]>([]);

  const [selectedCell, setSelectedCell] = useState<CellCoordinates>(null);
  const [secondSelectedCell, setSecondSelectedCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<CellCoordinates>(null);
  const [selectedDayStart, setSelectedDayStart] = useState<Date | null>(null);
  const [selectedDayEnd, setSelectedDayEnd] = useState<Date | null>(null);
  const [cellClasses, setCellClasses] = useState<{ rowIndex: number; colIndex: number; classes: string[] }[]>([]);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);
  const scrollContainerWrapper = useRef<HTMLDivElement>(null);
  const currentDate = startOfDay(new Date());

  // Generate an array of days for the specified year
  const days = eachDayOfInterval({
    start: startOfYear(new Date(year, 0, 1)),
    end: endOfYear(new Date(year, 0, 1))
  });


  // Group dates by month
  const months = useMemo(() => {
    const monthMap = new Map();
    days.forEach(date => {
      const month = getMonth(date);
      const count = monthMap.get(month) || 0;
      monthMap.set(month, count + 1);
    });
    return Array.from(monthMap.entries());
  }, [year]);


  const isLastDayOfMonth = (date: Date): boolean => {
    const lastDayOfMonth = endOfMonth(date);
    return isSameDay(date, lastDayOfMonth);
  };


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
  


  // const unavailableRangeDates = bookingObjects.flatMap(bookingObject =>
  //   bookingObject.blockedDateRanges.map(range => ({
  //     start: range.start,
  //     end: range.end,
  //     type: range.type,
  //     tooltip: range.tooltip // Include the tooltip property if it exists
  //   }))
  // );

  const blockedRangeDatesLookup: { [key: string]: BlockedDateRangeInfo[] } = {};

  bookingObjects.forEach(bookingObject => {
    blockedRangeDatesLookup[bookingObject.id] = bookingObject.blockedDateRanges.map(range => {
      return {
        start: range.start,
        end: range.end,
        type: range.type,
        tooltip: range.tooltip
      };
    });
  });

  

const isDateUnavailable = (date: Date, objectId: string): boolean => {
  return blockedRangeDatesLookup[objectId].some(range => {
    const rangeStart = parseISO(range.start);
    const rangeEnd = parseISO(range.end);

    return isWithinInterval(date, { start: rangeStart, end: rangeEnd });
  });
};

  

  const getBlockedDateRangeInfo = (date: Date, objectId:string): { isUnavailable: boolean; tooltip: string | null, isUnavailStart: boolean, isUnavailEnd: boolean } => {
    let isUnavailStart = false;
    let isUnavailEnd = false;

    const range = blockedRangeDatesLookup[objectId].find(range => {
      if (isSameDay(date, range.start)) {
        isUnavailStart = true;
        return true;
      }
      if (isSameDay(date, range.end)) {
        isUnavailEnd = true;
        return true;
      }

      // if (isWithinInterval(date, { start: range.start, end: range.end })) {

      //   setUnavailableCells(prev => [...prev, {rowIndex: rowIndex, colIndex: colIndex, objectId}]); 
      //   return true;
      // };
    });


    return {
      isUnavailable: !!range,
      tooltip: range?.tooltip || null,
      isUnavailStart,
      isUnavailEnd
    };
  };


  const handleDayClick = (clickedDate: Date, objectId:string, rowIndex: number, colIndex: number): void => {
    // Date selection logic
    if (selectedDayStart === null || (selectedDayStart !== null && selectedDayEnd !== null)) {
      setSelectedDayStart(clickedDate);
      setSelectedDayEnd(null);
      setSelectedCell({ rowIndex, colIndex });
      setSecondSelectedCell(null);
      setCellClasses([]);
    } else if (selectedDayStart !== null && selectedDayEnd === null) {
      
      const unavailableDaysBetween = areUnavailableDaysBetween(selectedDayStart, clickedDate, rowIndex);
      
      if (unavailableDaysBetween) {
        console.log('jjaaaa')
        setSelectedDayStart(clickedDate);
        setSelectedDayEnd(null);
        setSelectedCell({ rowIndex, colIndex });

        // Cell selection logic (if needed separately)
        handleCellClick(rowIndex, colIndex, unavailableDaysBetween);
        
      } else {
        setSelectedDayEnd(clickedDate);
        //change the order of the dates if the end date is before the start date
        if (clickedDate < selectedDayStart) {
          setSelectedDayEnd(selectedDayStart);
          setSelectedDayStart(clickedDate);
        }
        setSecondSelectedCell({ rowIndex, colIndex });
        if (selectedCell) {
          setHighlightedRange(selectedCell.rowIndex, selectedCell.colIndex, colIndex);
        }
        // Cell selection logic (if needed separately)
        handleCellClick(rowIndex, colIndex, false);
      }
    }
      
  };


  const handleCellClick = (rowIndex: number, colIndex: number, areBlockedDaysBetween: boolean): void => {
    // If a range is already selected, start a new selection
    if (selectedCell && (secondSelectedCell && rowIndex === secondSelectedCell.rowIndex)) {
      setSelectedCell({ rowIndex, colIndex });
      setSecondSelectedCell(null);
      setCellClasses([]);
      console.log('first and second')
    } else if (selectedCell && (rowIndex === selectedCell.rowIndex) && (colIndex !== selectedCell.colIndex) && areBlockedDaysBetween === false) {
      setSecondSelectedCell({ rowIndex, colIndex });
      // setCellClasses([{ rowIndex, colIndex, classes: ['is-selected'] }]);
      const startColIndex = Math.min(selectedCell.colIndex, colIndex);
      const endColIndex = Math.max(selectedCell.colIndex, colIndex);
      setHighlightedRange(rowIndex, startColIndex, endColIndex);
      console.log('second')
    } else if (selectedCell && (rowIndex === selectedCell.rowIndex) && (colIndex === selectedCell.colIndex) && areBlockedDaysBetween === false){
      //same day twice click
      setSecondSelectedCell({ rowIndex, colIndex });
      console.log('first twice')
    } else {
      setSecondSelectedCell(null);
      //avoid double first in different rows
      setCellClasses([{ rowIndex, colIndex, classes: ['is-selected'] }]);
      setSelectedCell({ rowIndex, colIndex });
      console.log('first')
    }
    setHoveredCell(null);
  };


  const setHighlightedRange = (rowIndex: number, startColIndex: number, endColIndex: number): void => {
    for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
      // Apply the "is-selected" class to the cell at rowIndex and colIndex
      applyClassToCell(rowIndex, colIndex, 'is-selected');
    }
  };


  // Helper function to apply class to a cell
  const applyClassToCell = (rowIndex: number, colIndex: number, className: string) => {
    // Find the existing cell entry or create a new one
    const cellEntryIndex = cellClasses.findIndex(entry => entry.rowIndex === rowIndex && entry.colIndex === colIndex);

    if (cellEntryIndex !== -1) {
      // Cell entry exists, update the classes
      const updatedCellClasses = [...cellClasses];
      updatedCellClasses[cellEntryIndex].classes = [className];
      setCellClasses(updatedCellClasses);
    } else {
      // Cell entry doesn't exist, create a new entry
      setCellClasses(prevCellClasses => [
        ...prevCellClasses,
        { rowIndex, colIndex, classes: [className] }
      ]);
    }
  };


  // Helper function to manage hover selection
  const handleCellHover = (rowIndex: number, colIndex: number, isAvailable: boolean) => {
    if (selectedCell && !secondSelectedCell && isAvailable) {
      console.log(isAvailable)
      setHoveredCell({ rowIndex, colIndex });
    }
  };


  // Helper function to manage hover selection
  const isCellInRange = (rowIndex: number, colIndex: number, isAvailable: boolean ) => {
    if (!selectedCell || !isAvailable) return false;
    if (rowIndex !== selectedCell.rowIndex) return false;

    const endCell = secondSelectedCell || hoveredCell;
    if (!endCell) return false;

    const startColIndex = Math.min(selectedCell.colIndex, endCell.colIndex);
    const endColIndex = Math.max(selectedCell.colIndex, endCell.colIndex);
    return colIndex >= startColIndex && colIndex <= endColIndex;
  };


  // Functions to handle scrolling
  const scrollToCurrentDay = () => {
    if (scrollContainer.current) {
      // Assuming each day's element has an ID like 'day-YYYY-MM-DD'
      // const today = format(new Date(), 'yyyy-MM-dd');
      const dayElement = scrollContainer.current.querySelector(`#isToday`);

      if (dayElement) {
        dayElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
    }
  };

  const scrollLeft = () => {
    // Logic to scroll left
    if (scrollContainer.current && scrollContainerWrapper.current) {
      let newScrollPosition = scrollContainerWrapper.current.offsetWidth;
      scrollContainer.current.scrollBy({ left: -newScrollPosition, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    // Logic to scroll right
    if (scrollContainer.current && scrollContainerWrapper.current) {
      let newScrollPosition = scrollContainerWrapper.current.offsetWidth;
      scrollContainer.current.scrollBy({ left: newScrollPosition, behavior: 'smooth' });
    }
  };


  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Check if the click is outside of the table body
      if (tableBodyRef.current && !tableBodyRef.current.contains(event.target as Node)) {
        setSelectedCell(null);
        setSecondSelectedCell(null);
        setCellClasses([]);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);



  return (
    <div className="w-full">
      <div className="py-2 flex justify-end items-center">
        <button onClick={scrollLeft} className="mx-2 p-1 border border-gray-300 rounded">&lt;</button>
        <button onClick={scrollToCurrentDay} className="mx-2 p-1 border border-gray-300 rounded">Today</button>
        <button onClick={scrollRight} className="mx-2 p-1 border border-gray-300 rounded">&gt;</button>
      </div>
      <div className="flex">
        {/* Titles Table */}
        <div className="titles-table flex items-end w-full max-w-5xl pb-4 mb-[2px] mr-[-1px]">
          <table className="w-full min-w-[220px] max-w-5xl">
            {/* <thead>
              <tr><th className="cell-month-date">&nbsp;</th></tr>
              <tr><th className="cell-day-date">&nbsp;</th></tr>
            </thead> */}
            <tbody>
              {bookingObjects.map((bookingObject) => (
                <tr key={bookingObject.id}>
                  <td
                    className="object-titles"
                  >
                    {bookingObject.title} {/* Assuming each bookingObject has a title */}
                  </td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div ref={scrollContainerWrapper} className="w-full max-w-5xl">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-900 pb-3" ref={scrollContainer}>
            <table className="min-w-full" ref={tableRef}>
              <thead>
                <tr>
                  {months.map(([month, count], monthIndex) => (
                    <th
                      key={monthIndex}
                      colSpan={count}
                      className={`
                  p-1 h-10 border border-r-2 border-l-2 border-gray-500
                `}
                    >
                      {getMonthName(year, month)} {year}
                    </th>
                  ))}
                </tr>
                <tr>
                  {days.map((date, dayIndex) => (
                    <th
                      key={date.toISOString()}
                      className={`
                        cell cell-day-date
                        ${dayIndex === 0 ? 'first-of-month' : ''}
                        ${isLastDayOfMonth(date) ? 'last-of-month' : ''}
                        ${isSameDay(date, currentDate) ? 'bg-green-100/10 text-green-600 is-today' : ''}
                        ${getDay(date) === 0 ? 'text-red-500 bg-red-100/10' : ''}
                      `}
                      >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-xs font-light block mb-1">{getDayName(date)}</span>
                        <span className="text-xs block">{format(date, 'd')}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody ref={tableBodyRef}>
                {bookingObjects.map((bookingObject, rowIndex) => (
                  <tr key={rowIndex}>
                    {days.map((date, colIndex) => {

                        let unavailableClassNames:string[] = [];
                        const isUnavailable = isDateUnavailable(date, bookingObject.id);
                        
                      if (isUnavailable === true) {
                          console.log(date)
                          // setUnavailableCells(prev => [...prev, {rowIndex, colIndex}]);
                          const { tooltip, isUnavailStart, isUnavailEnd } = getBlockedDateRangeInfo(date, bookingObject.id);
                          unavailableClassNames = [
                            isUnavailable ? 'bg-red-100/60 is-unavailable' : '',
                            isUnavailStart ? 'is-unavail-start' : '',
                            isUnavailEnd ? 'is-unavail-end' : '',
                          ]
                        }
                      
                  
                      const cellClassNames = [
                        'cell cell-day',
                        colIndex === 0 ? 'first-of-month' : '',
                        isCellInRange(rowIndex, colIndex, !isUnavailable) ? 'highlight' : '',
                        selectedCell?.rowIndex === rowIndex && selectedCell?.colIndex === colIndex ? 'is-selected' : '',
                        isSameDay(date, currentDate) ? 'bg-green-100/10' : '',
                        getDay(date) === 0 ? 'bg-red-100/10' : '',
                        isLastDayOfMonth(date) ? 'last-of-month' : '',
                        cellClasses.find(entry => entry.rowIndex === rowIndex && entry.colIndex === colIndex)?.classes?.join(' ') || ''
                      ];
                      return (
                        <td
                          key={`${rowIndex}-${colIndex}`}
                          id={isSameDay(date, currentDate) ? 'isToday' : `${rowIndex}-${colIndex}`}
                          onClick={() => handleDayClick(date, bookingObject.id, rowIndex, colIndex)}
                          onMouseEnter={() => handleCellHover(rowIndex, colIndex, !isUnavailable)}
                          className={`${cellClassNames.join(' ')} ${unavailableClassNames.join(' ')} `}
                        >
                          <div
                            className="cell-marker"
                            data-object-id={bookingObject.id}
                            data-date-string={formatDate(date)}>
                            {/* This is the clickable/selectable cell */}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Legend />
    </div>
  );

};

export default TableWithDateRange;
