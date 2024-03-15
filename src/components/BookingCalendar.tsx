import React, { useState, useMemo, useEffect, useRef } from 'react';
import { getMonth, getYear } from 'date-fns';
import { generateCalendarDays, preCalculateDaysStatusFlags } from "../utils/dateUtils";
import { BookingCalendarSettings, ColorSettings, VisibleMonthYear } from "../types";
import Legend from "./Legend";
import BookingObjectsTable from "./BookingObjectsTable"
import BookingCalendarScrollContainer, { ScrollContainerRefs } from "./BookingCalendarScrollContainer";
import ScrollPaginationButtons from "./ScrollPaginationButtons";
import BookingCalendarTable from "./BookingCalendarTable";
import { BookingObjectsProvider } from "../context/BookingObjectsContext";
import MonthDropdown from "./MonthDropdown";
import { Progress } from "./ui/progress";

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
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [calendarSettings, setCalendarSettings] = useState<BookingCalendarSettings[]>([]);
  const [visibleMonths, setVisibleMonths] = useState<VisibleMonthYear[]>([{ month: new Date().getMonth() + 1, year: new Date().getFullYear() }]);
  const [isTodayView, setIsTodayView] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const bookingCalendarWrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<ScrollContainerRefs>(null);

  useEffect(() => {
    let isComponentMounted = true;

    const init = async () => {

      if (!isComponentMounted) return;

      console.log("Effect running");
      setIsLoading(true);
      setError(null);
      setProgress(30);

      try {
        const apiUrl = `https://www.webplanner.de/tools/belegungsplanerapi.php?fewoOwnID=${fewoOwnID}&lang=${lang}&anfrage=3`;
        const response = await fetch(apiUrl);
        setProgress(60);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCalendarSettings(Array.isArray(data) ? data : [data]); // Ensure it's always an array
        setProgress(80);

        if (data.length > 0 && data[0].colorSettings) {
          updateGlobalStyles(data[0].colorSettings);
        }
        setProgress(100)
        setTimeout(() => setIsLoading(false), 500)
        
      } catch (error) {
        console.error("Failed to fetch calendar settings:", error);
        setError("Failed to fetch calendar settings");
        setIsLoading(false);
        setProgress(100);
        throw error;
      }

    };
    init();
   
    return () => {
      isComponentMounted = false; // Clean up function setting the flag to false when component unmounts
      console.log("Cleanup called");
    };

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

    if (days.length === 0) return [];
    return preCalculateDaysStatusFlags(calendarSettings[0]?.bookingObjects, days);

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


  if (progress <= 100 && isLoading) {
    return (
      <div className="w-[60%] m-auto">
        <Progress value={progress} max={100} />
        <p className="mt-1">Kalenderdaten werden geladen...</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (calendarSettings.length === 0 || calendarSettings[0]?.calendarRange === undefined) {
    return <div>No calendar settings available.</div>;
  }

  const { colorSettings, bookingObjects } = calendarSettings[0];

  // Function to update visible months and years, based on scroll position
  const updateVisibleMonthsAndYears = (months: VisibleMonthYear[]) => {
    setVisibleMonths(months);
  };



  // Function to update the scroll state
  const updateScrollState = (scrollLeft: number, scrollWidth: number, clientWidth: number) => {
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };


  return (
    <div className="booking-calendar-wrapper w-full overflow-hidden animate-fadeIn" ref={bookingCalendarWrapperRef} >
      <BookingObjectsProvider bookingObjects={bookingObjects}>
        {/* <MonthPaginationButtons scrollRef={scrollRef} months={months} /> */}

        <div className="flex">
          <div className="hidden sm:flex items-end pb-4 mb-[2px] mr-[-1px] min-w-[80px] max-w-[240px] w-[15vw]">
          </div>
          <div className="py-2 flex flex-1 flex-col sm:flex-row sm:justify-between items-center gap-2 ml-0 mr-2 w-max-full">

            <MonthDropdown
              scrollRef={scrollRef}
              months={months}
            />
            <ScrollPaginationButtons
              scrollRef={scrollRef}
              visibleMonths={visibleMonths}
              isTodayView={isTodayView}
              canScrollLeft={canScrollLeft}
              canScrollRight={canScrollRight}
              calendarRange={calendarSettings[0]?.calendarRange}
            />

          </div>
        </div>
        <div className="flex">
          <BookingObjectsTable bookingObjects={bookingObjects} />
          <BookingCalendarScrollContainer
            ref={scrollRef}
            updateVisibleMonthsAndYears={updateVisibleMonthsAndYears}
            updateIsTodayView={setIsTodayView}
            updateScrollState={updateScrollState}
          >
            <BookingCalendarTable
              months={months}
              days={days}
              daysWithStatus={daysWithStatus}
              bookingObjects={bookingObjects}
              currentDate={new Date()}
              bookingCalendarWrapperRef={bookingCalendarWrapperRef}
            />
          </BookingCalendarScrollContainer>
        </div>
        <Legend colorSettings={colorSettings} />
      </BookingObjectsProvider>

    </div>
  );

};

export default BookingCalendar;
