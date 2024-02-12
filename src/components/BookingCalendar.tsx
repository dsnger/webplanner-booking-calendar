import React, { useState, useMemo, useEffect, useRef } from 'react';
import { getMonth, getYear } from 'date-fns';
import { fetchCalendarSettings, generateCalendarDays } from "../utils";
import { BookingCalendarSettings, ColorSettings, CellCoordinates } from "../types";
import Legend from "./Legend";
import BookingObjectsTable from "./BookingObjectsTable"
import BookingCalendarScrollContainer, { ScrollContainerRefs } from "./BookingCalendarScrollContainer";
import ScrollPaginationButtons from "./ScrollPaginationButtons";
import BookingCalendarTable from "./BookingCalendarTable";




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
  const [calendarSettings, setCalendarSettings] = useState<BookingCalendarSettings[]>([]);

  const [selectedCell, setSelectedCell] = useState<CellCoordinates>(null);
  // const [secondSelectedCell, setSecondSelectedCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);
  // const [hoveredCell, setHoveredCell] = useState<CellCoordinates>(null);
  // const [selectedDayStart, setSelectedDayStart] = useState<Date | null>(null);
  // const [selectedDayEnd, setSelectedDayEnd] = useState<Date | null>(null);
  const [cellClasses, setCellClasses] = useState<{ rowIndex: number; colIndex: number; classes: string[] }[]>([]);



  // const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  // const tableRef = useRef<HTMLTableElement>(null);
  const bookingCalendarWrapperRef = useRef<HTMLDivElement>(null);
  // const scrollParentRef = useRef<ScrollContainerRefs>(null);
  const scrollRef = useRef<ScrollContainerRefs>(null);
  // const currentDate = startOfDay(new Date());


  // Fetch calendar settings
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const getCalendarSettings = async () => {
      try {
        const data = await fetchCalendarSettings(fewoOwnID, lang);
        setCalendarSettings(Array.isArray(data) ? data : [data]); // Ensure it's always an array
        setIsLoading(false);
      } catch (error) {
        console.error("Fetching calendar settings failed", error);
        setError("Failed to fetch calendar settings");
        setIsLoading(false);
      }
    };

    getCalendarSettings();
  }, [fewoOwnID, lang]);


  // Compute days and year after ensuring calendarSettings[0] exists
  const days = useMemo(() => {
    if (calendarSettings.length === 0 || !calendarSettings[0]?.calendarRange) {
      return [];
    }
    return generateCalendarDays(calendarSettings[0].calendarRange);
  }, [calendarSettings]);



  // const year = useMemo(() => {
  //   if (calendarSettings.length === 0 || !calendarSettings[0]?.calendarRange || days.length === 0) {
  //     return new Date().getFullYear();
  //   }
  //   const parsedStartDate = parseISO(calendarSettings[0].calendarRange.startDate)
  //   return getYear(parsedStartDate)
  // }, [calendarSettings]);



  // Group date by year
  // const years = useMemo(() => {
  //   if (!days.length) return []; // Early return if days is empty
  
  //   const yearMap = new Map<number, number>();
  //   days.forEach(date => {
  //     const year = getYear(date); // Extract the year from each date
  //     const count = yearMap.get(year) || 0; // Get the current count for this year, defaulting to 0
  //     yearMap.set(year, count + 1); // Increment the count for this year
  //   });
  
  //   return Array.from(yearMap, ([year, count]) => ({ year, count }));
  //   // Optionally, you can return an array of objects for easier consumption: [{ year, count }]
  // }, [days]);


  const months = useMemo(() => {
    if (!days.length) return []; // Early return if days is empty
  
    const monthMap = new Map();
    days.forEach(date => {
      // Combine year and month to ensure uniqueness across years
      const yearMonthKey = `${getYear(date)}-${getMonth(date)}`;
      const count = monthMap.get(yearMonthKey) || 0;
      monthMap.set(yearMonthKey, count + 1);
    });
  
    // Convert the map into an array of [yearMonthKey, count] pairs
    return Array.from(monthMap.entries()).map(([yearMonthKey, count]) => {
      // Optionally, split the key back into year and month if needed for downstream processing
      const [year, month] = yearMonthKey.split('-').map(Number); // Convert back to numbers
      return { year, month, count }; // Return an object for easier access to year, month, and count
    });
  }, [days]);


  useEffect(() => {
    if (calendarSettings.length > 0 && calendarSettings[0].colorSettings) {
      updateGlobalStyles(calendarSettings[0].colorSettings);
    }
  }, [calendarSettings]);


  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Check if the click is outside of the table body
      if (bookingCalendarWrapperRef.current && !bookingCalendarWrapperRef.current.contains(event.target as Node)) {
        setSelectedCell(null);
        // setSecondSelectedCell(null);
        setCellClasses([]);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (calendarSettings.length === 0 || calendarSettings[0]?.calendarRange === undefined) {
    return <div>No calendar settings available.</div>;
  }

  const { colorSettings, bookingObjects } = calendarSettings[0];


  return (
    <div className="booking-calendar-wrapper w-full" ref={bookingCalendarWrapperRef}>
       
      <ScrollPaginationButtons scrollRef={scrollRef} />
      
      <div className="flex">
        <BookingObjectsTable bookingObjects={bookingObjects} />
        <BookingCalendarScrollContainer ref={scrollRef}>
        <BookingCalendarTable
            months={months}
            days={days}
            bookingObjects={bookingObjects}
            selectedCell={selectedCell}
            currentDate={new Date()}
            cellClasses={cellClasses}
          />
        </BookingCalendarScrollContainer>
      </div>
      <Legend colorSettings={colorSettings}/>
    </div>
  );

};

export default BookingCalendar;
