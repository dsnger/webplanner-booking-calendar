import React, { useState, useMemo, useEffect, useRef } from 'react';
import { isSameDay, startOfDay, endOfMonth, eachDayOfInterval, getDay, getMonth, getYear, format, startOfYear, endOfYear, isWithinInterval, parseISO, isBefore, parse, addMonths, addYears } from 'date-fns';
import { getMonthName, getDayName, formatDate, fetchCalendarSettings } from "../utils";
import { BlockedDateRangeInfo, BookingCalendarSettings, DateRangeType, ColorSettings, CalendarRange } from "../types";
import Legend from "./Legend";

type CellCoordinates = { rowIndex: number; colIndex: number } | null;

interface BookingCalendarProps {
  fewoOwnID: number;
  lang: string;
}


const updateGlobalStyles = (colorSettings: ColorSettings) => {
  const root = document.documentElement;

  root.style.setProperty('--day-booked', colorSettings.booked);
  root.style.setProperty('--day-available', colorSettings.available);
  root.style.setProperty('--day-unavailable', colorSettings.notAvailable);
  root.style.setProperty('--day-onrequest', colorSettings.onRequest);
  root.style.setProperty('--day-closed', colorSettings.closed);
};


const BookingCalendar: React.FC<BookingCalendarProps> = ({ fewoOwnID, lang }): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarSettings, setCalendarSettings] = useState<BookingCalendarSettings | null>(null);
  
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const getCalendarSettings = async () => {
      try {
        const data = await fetchCalendarSettings(fewoOwnID, lang);
        setCalendarSettings(data);
        setIsLoading(false);
      } catch (error) {
        // Handle or display the error as needed
        console.error("Fetching calendar settings failed", error);
        setError("Failed to fetch calendar settings");
        setIsLoading(false);
      }
    };

    getCalendarSettings();
  }, [fewoOwnID, lang]); // Depend on fewoOwnID and lang to refetch if either changes

  
  if ( calendarSettings === null || calendarSettings.calendarRange === undefined) {
    return <div>No calendar settings available.</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
 
  const { calendarRange, colorSettings, bookingObjects } = calendarSettings;

  const [selectedCell, setSelectedCell] = useState<CellCoordinates>(null);
  const [secondSelectedCell, setSecondSelectedCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<CellCoordinates>(null);
  const [selectedDayStart, setSelectedDayStart] = useState<Date | null>(null);
  const [selectedDayEnd, setSelectedDayEnd] = useState<Date | null>(null);
  const [cellClasses, setCellClasses] = useState<{ rowIndex: number; colIndex: number; classes: string[] }[]>([]);
  
  const bookingCalendarWrapperRef = useRef<HTMLDivElement>(null);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);
  const scrollContainerWrapper = useRef<HTMLDivElement>(null);
  const currentDate = startOfDay(new Date());
  const parsedStartDate = parse(calendarRange.startDate, 'yyyy-mm-dd', new Date());
  const year = getYear(parsedStartDate);

 



  if (colorSettings === null) {
    useEffect(() => {
      updateGlobalStyles(colorSettings);
    }, [colorSettings, cellClasses]);
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Check if the click is outside of the table body
      if (bookingCalendarWrapperRef.current && !bookingCalendarWrapperRef.current.contains(event.target as Node)) {
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


  const generateCalendarDays = (calendarRange: CalendarRange): Date[] => {
    const { startDate, endDate, duration } = calendarRange;
  
    // Parse the start date or use the start of the current year if not provided
    let start = startDate ? parseISO(startDate) : startOfYear(new Date());
  
    let end;
    if (endDate) {
      // Parse the end date if provided
      end = parseISO(endDate);
    } else if (duration) {
      // Use duration to calculate the end date if endDate is not provided
      if (duration.monthCount) {
        end = addMonths(start, duration.monthCount );
      } else if (duration.yearCount) {
        end = addYears(start, duration.yearCount);
      } else {
        // Default to end of the year if neither monthCount nor yearCount is provided
        end = endOfYear(start);
      }
    } else {
      // Default to end of the year if neither endDate nor duration is provided
      end = endOfYear(start);
    }
  
    const days = eachDayOfInterval({ start, end });
    return days;
  };
  
  // Usage
  const days = generateCalendarDays(calendarRange);


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
  

  const blockedRangeDatesLookup: { [key: string]: BlockedDateRangeInfo[] } = {};
  bookingObjects.forEach(bookingObject => {
    blockedRangeDatesLookup[bookingObject.objId] = bookingObject.blockedDateRanges.map(range => {
      return {
        start: range.start,
        end: range.end,
        type: range.type as DateRangeType,
        tooltip: range.tooltip
      };
    });
  });

  
  // const isDateUnavailable = (date: Date, objId: string): boolean => {
  //   return blockedRangeDatesLookup[objId].some(range => {
  //     const rangeStart = parseISO(range.start);
  //     const rangeEnd = parseISO(range.end);

  //     return isWithinInterval(date, { start: rangeStart, end: rangeEnd });
  //   });
  // };
    
  
  const isDateType = (date: Date, objId: string, type: 'arrival' | 'departure'): boolean => {
    const bookingObject = bookingObjects.find(obj => obj.objId === objId);
  
    if (!bookingObject) {
      return false;
    }
  
    const dateStrings = type === 'arrival'
      ? bookingObject.dayTypes.arrivalDays.dates
      : bookingObject.dayTypes.departureDays.dates;
  
    return dateStrings.some(dateString => {
      const day = new Date(dateString);
      return day.getFullYear() === date.getFullYear() &&
             day.getMonth() === date.getMonth() &&
             day.getDate() === date.getDate();
    });
  };
  

  const isBlockedDateRange = (date: Date, objId:string): { isUnavailable: boolean; tooltip: string | null, isUnavailStart: boolean, isUnavailEnd: boolean } => {
    let isUnavailStart = false;
    let isUnavailEnd = false;
    let isUnavailable = false;

    const range = blockedRangeDatesLookup[objId].find(range => {
      if (isSameDay(date, range.start)) {
        isUnavailStart = true;
        return true;
      }
      if (isSameDay(date, range.end)) {
        isUnavailEnd = true;
        return true;
      }

      if (isWithinInterval(date, { start: parseISO(range.start), end: parseISO(range.end) })) {
        isUnavailable = true;
        return true;
      }
     
    });

    return {
      isUnavailable,
      tooltip: range?.tooltip || null,
      isUnavailStart,
      isUnavailEnd
    };
  };


  const handleDateSelection = (clickedDate: Date, rowIndex: number, colIndex: number): void => {
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
        handleCellSelection(rowIndex, colIndex, unavailableDaysBetween);
        
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
        handleCellSelection(rowIndex, colIndex, false);
      }
    }
      
  };

  const handleCellSelection = (rowIndex: number, colIndex: number, areBlockedDaysBetween: boolean): void => {
    
    //zweite Auswahl, aber andere Zeile
    if (selectedCell && (secondSelectedCell && rowIndex === selectedCell.rowIndex)) {
      setSelectedCell({ rowIndex, colIndex });
      setSecondSelectedCell(null);
      setCellClasses([]);
      console.log('first and second')
      
      //gleiche Zeile, anderer Tag
    } else if (selectedCell && (rowIndex === selectedCell.rowIndex) && (colIndex !== selectedCell.colIndex) && areBlockedDaysBetween === false) {
      setSecondSelectedCell({ rowIndex, colIndex });
      setCellClasses([{ rowIndex, colIndex, classes: ['is-selected'] }]);
      setHighlightedRange(selectedCell.rowIndex, selectedCell.colIndex, colIndex);
      console.log('second')

      //gleiche Zeile, gleicher Tag
    } else if (selectedCell && (rowIndex === selectedCell.rowIndex) && (colIndex === selectedCell.colIndex) && areBlockedDaysBetween === false){
      //same day twice click
      setSecondSelectedCell({ rowIndex, colIndex });
      console.log('first twice')

    } else if((selectedCell === null && secondSelectedCell === null) || secondSelectedCell !== null) {
      setSelectedCell({ rowIndex, colIndex });
      //avoid double first in different rows
      setCellClasses([{ rowIndex, colIndex, classes: ['is-selected'] }]);
      setSecondSelectedCell(null);
      
      console.log('first')
    }

    setHoveredCell(null);
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
  
  // Helper function to manage hover selection
  const handleCellHover = (rowIndex: number, colIndex: number, isAvailable: boolean) => {
    if (selectedCell && !secondSelectedCell && isAvailable) {
      // console.log(isAvailable)
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


  


  return (
    <div className="booking-calendar-wrapper w-full" ref={bookingCalendarWrapperRef}>
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
                <tr key={bookingObject.objId}>
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

                        let dayTypesClassNames:string[] = [];
                        const { isUnavailable, isUnavailStart, isUnavailEnd } = isBlockedDateRange(date, bookingObject.objId);
                        const isArrival = isDateType(date, bookingObject.objId, 'arrival');
                        const isDeparture = isDateType(date, bookingObject.objId, 'departure');
                      
                        dayTypesClassNames = [
                          isArrival ? 'is-arrival' : '',
                          isDeparture ? 'is-departure' : '',
                          isUnavailable ? 'is-unavailable' : 'is-available',
                          isUnavailStart ? 'is-unavailable is-start' : '',
                          isUnavailEnd ? 'is-unavailable is-end' : '',
                        ]
                        
                  
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
                          onClick={() => handleDateSelection(date, rowIndex, colIndex)}
                          onMouseEnter={() => handleCellHover(rowIndex, colIndex, !isUnavailable)}
                          className={`${dayTypesClassNames.join(' ')}${cellClassNames.join(' ')}  `}
                        >
                          <div
                            className="cell-marker"
                            data-object-id={bookingObject.objId}
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
      {/* <Legend colorSettings={ colorSettings } /> */}
    </div>
  );

};

export default BookingCalendar;
