import React, { useState, useMemo, useEffect, useRef } from 'react';
import { getMonth, getYear } from 'date-fns';
import { generateCalendarDays, preCalculateStatusFlags } from "../utils/dateUtils";
import { BookingCalendarSettings, ColorSettings } from "../types";
import Legend from "./Legend";
import BookingObjectsTable from "./BookingObjectsTable"
import BookingCalendarScrollContainer, { ScrollContainerRefs } from "./BookingCalendarScrollContainer";
import ScrollPaginationButtons from "./ScrollPaginationButtons";
import BookingCalendarTable from "./BookingCalendarTable";
// import MonthPaginationButtons from "./MonthPaginationButtons";


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
  const [visibleMonth, setVisibleMonth] = useState(new Date().getMonth() + 1); // Adjust to initial visible month based on your app's logic
  const [visibleYear, setVisibleYear] = useState(new Date().getFullYear());

  const bookingCalendarWrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<ScrollContainerRefs>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const fetchCalendarSettings = async () => {
      const apiUrl = `https://www.webplanner.de/tools/belegungsplanerapi.php?fewoOwnID=${fewoOwnID}&lang=${lang}&anfrage=3`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        setCalendarSettings(Array.isArray(data) ? data : [data]); // Ensure it's always an array
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch calendar settings:", error);
        setError("Failed to fetch calendar settings");
        setIsLoading(false);
        throw error;
      }
    };
    fetchCalendarSettings();
  }, [fewoOwnID, lang]);


  // Compute days and year after ensuring calendarSettings[0] exists
  const days = useMemo(() => {
    if (calendarSettings.length === 0 || !calendarSettings[0]?.calendarRange) {
      return [];
    }
    return generateCalendarDays(calendarSettings[0].calendarRange);
  }, [calendarSettings]);
  

   // Use useMemo to precalculate status flags for the generated days
   const daysWithStatus = useMemo(() => {
    if (days.length === 0 ) return [];
    return preCalculateStatusFlags(calendarSettings[0]?.bookingObjects, days);
   }, [days, calendarSettings]);


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

   // Function to update visible month and year, based on scroll position
   const updateVisibleMonthAndYear = (month: number, year: number) => {
    setVisibleMonth(month);
    setVisibleYear(year);
  };


  return (
    <div className="booking-calendar-wrapper w-full" ref={bookingCalendarWrapperRef}>
       
      {/* <MonthPaginationButtons scrollRef={scrollRef} months={months} /> */}
      <ScrollPaginationButtons
        scrollRef={scrollRef}
        visibleMonth={visibleMonth}
        visibleYear={visibleYear}
        updateVisibleMonthAndYear={updateVisibleMonthAndYear}
      />
      
      <div className="flex">
      <BookingObjectsTable bookingObjects={bookingObjects} />
        <BookingCalendarScrollContainer ref={scrollRef}>
        <BookingCalendarTable
            months={months}
            days={days}
            daysWithStatus={daysWithStatus}
            bookingObjects={bookingObjects}
            currentDate={new Date()}
          />
        </BookingCalendarScrollContainer>
      </div>
      <Legend colorSettings={colorSettings}/>
    </div>
  );

};

export default BookingCalendar;
