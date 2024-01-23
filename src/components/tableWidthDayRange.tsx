import React, { useState, useMemo, useEffect, useRef } from 'react';
import { isSameDay, startOfDay, endOfMonth, eachDayOfInterval, getDay, getMonth, format, startOfYear, endOfYear, isWithinInterval, parseISO } from 'date-fns';
import { getMonthName, getDayName, formatDate } from "../utils";
import { BookingObject, DateRange, BlockedDateRangeInfo } from "../types";
import Legend from "./Legend";

type CellCoordinates = { rowIndex: number; colIndex: number } | null;

interface TableWithDateRangeProps {
  year: number; // Replace 'any' with the appropriate type for your rows
  bookingObjects: BookingObject[]; // Replace 'any' with the appropriate type for your days
}

const TableWithDateRange: React.FC<TableWithDateRangeProps> = ({ year, bookingObjects }): JSX.Element => {
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


  const areUnavailableDaysBetween = (start: Date, end: Date, unavailableRangeDates: BlockedDateRangeInfo[]) => {

    return unavailableRangeDates.some(range => {

      const rangeStart = parseISO(range.start);
      const rangeEnd = parseISO(range.end);
  
      // Check if any day in the range of start to end is within an unavailable date range
      return isWithinInterval(start, { start: rangeStart, end: rangeEnd }) ||
        isWithinInterval(end, { start: rangeStart, end: rangeEnd }) ||
        (start < rangeStart && end > rangeEnd) || (start > rangeStart && end < rangeEnd);
    });
  };


  const unavailableRangeDates = bookingObjects.flatMap(bookingObject =>
    bookingObject.blockedDateRanges.map(range => ({
      start: range.start,
      end: range.end,
      type: range.type,
      tooltip: range.tooltip // Include the tooltip property if it exists
    }))
  );


  const handleDayClick = (clickedDate: Date, rowIndex: number, colIndex: number): void => {
    // Date selection logic
    if (selectedDayStart === null || (selectedDayStart !== null && selectedDayEnd !== null)) {
      setSelectedDayStart(clickedDate);
      setSelectedDayEnd(null);
      setSelectedCell({ rowIndex, colIndex });
      setSecondSelectedCell(null);
      setCellClasses([]);
    } else if (selectedDayStart !== null && selectedDayEnd === null) {
      const unavailableDaysBetween = areUnavailableDaysBetween(selectedDayStart, clickedDate, unavailableRangeDates);
      if (unavailableDaysBetween) {
        setSelectedDayStart(clickedDate);
        setSelectedDayEnd(null);
        setSelectedCell({ rowIndex, colIndex });
      } else {
        setSelectedDayEnd(clickedDate);
        if (clickedDate < selectedDayStart) {
          setSelectedDayEnd(selectedDayStart);
          setSelectedDayStart(clickedDate);
        }
        setSecondSelectedCell({ rowIndex, colIndex });
        if (selectedCell) {
          setHighlightedRange(selectedCell.rowIndex, selectedCell.colIndex, colIndex);
        }
      }
    }

    // Cell selection logic (if needed separately)
    handleCellClick(rowIndex, colIndex);
  };


  const handleCellClick = (rowIndex: number, colIndex: number): void => {
    // If a range is already selected, start a new selection
    if (selectedCell && secondSelectedCell) {
      setSelectedCell({ rowIndex, colIndex });
      setSecondSelectedCell(null);
      setCellClasses([]);
    } else if (selectedCell && (rowIndex === selectedCell.rowIndex) && (colIndex !== selectedCell.colIndex)) {
      setSecondSelectedCell({ rowIndex, colIndex });
      const startColIndex = Math.min(selectedCell.colIndex, colIndex);
      const endColIndex = Math.max(selectedCell.colIndex, colIndex);
      setHighlightedRange(rowIndex, startColIndex, endColIndex);
    } else {
      setSelectedCell({ rowIndex, colIndex });
    }
    setHoveredCell(null);
  };


  const setHighlightedRange = (rowIndex: number, startColIndex: number, endColIndex: number): void => {
    for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
      // Apply the "is-selected" class to the cell at rowIndex and colIndex
      applyClassToCell(rowIndex, colIndex, 'is-selected');
    }
  };


  // Function to apply class to a cell
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



  const handleCellHover = (rowIndex: number, colIndex: number) => {
    if (selectedCell && !secondSelectedCell) {
      setHoveredCell({ rowIndex, colIndex });
    }
  };

  const isCellInRange = (rowIndex: number, colIndex: number) => {
    if (!selectedCell) return false;
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
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);



  return (
    <div className="w-full">
      <div className="py-2 flex justify-center items-center">
        <button onClick={scrollLeft} className="mx-2 p-1 border border-gray-300 rounded">&lt;</button>
        <button onClick={scrollToCurrentDay} className="mx-2 p-1 border border-gray-300 rounded">Today</button>
        <button onClick={scrollRight} className="mx-2 p-1 border border-gray-300 rounded">&gt;</button>
      </div>
      <div className="flex">
        {/* Titles Table */}
        <div className="titles-table w-full max-w-5xl">
          <table className="w-full min-w-[220px] max-w-5xl">
            <thead>
              <tr><th className="p-1 h-10  text-sm">&nbsp;</th></tr>
              <tr><th className="p-1 h-10  text-sm">&nbsp;</th></tr>
            </thead>
            <tbody>
              {bookingObjects.map((bookingObject, bookingObjectIndex) => (
                <tr key={bookingObject.id}>
                  <td
                    className="title-row text-left h-6 px-1 py-1 m-0 border border-r-1 border-l-0 border-gray-500 truncate"
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
                  h-10 border-l border-r border-b border-gray-500
                  ${dayIndex === 0 ? 'border-l-2' : ''}
                  ${isLastDayOfMonth(date) ? 'border-r-2' : ''}
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
                {bookingObjects.map((objectId, rowIndex) => (
                  <tr key={rowIndex}>
                    {days.map((date, colIndex) => {
                      const cellClassNames = [
                        'cell h-6',
                        colIndex === 0 ? 'border-l-2' : '',
                        isCellInRange(rowIndex, colIndex) ? 'highlight' : '',
                        selectedCell?.rowIndex === rowIndex && selectedCell?.colIndex === colIndex ? 'is-selected' : '',
                        isSameDay(date, currentDate) ? 'bg-green-100/10' : '',
                        getDay(date) === 0 ? 'bg-red-100/10' : '',
                        isLastDayOfMonth(date) ? 'border-r-2' : '',
                        cellClasses.find(entry => entry.rowIndex === rowIndex && entry.colIndex === colIndex)?.classes?.join(' ') || ''
                      ];
                      return (
                        <td
                          key={`${rowIndex}-${colIndex}`}
                          id={'isToday'}
                          onClick={() => handleDayClick(date, rowIndex, colIndex)}
                          onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                          className={`${cellClassNames.join(' ')} `}
                        >
                          <div className="px-3 h-6 cursor-pointer" data-object-id={objectId} data-date-string={formatDate(date)}>
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
