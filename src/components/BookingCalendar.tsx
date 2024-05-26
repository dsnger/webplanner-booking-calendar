import React, { useState, useMemo, useEffect, useRef } from 'react';
import { getMonth, getYear } from 'date-fns';
import { generateCalendarDays, preCalculateDaysStatusFlags, setDayCountGlobalVar } from "../utils/dateUtils";
import { VisibleMonthYear } from "../types";
import Legend from "./Legend";
import BookingObjectsTable from "./BookingObjects";
import BookingCalendarScrollContainer, { ScrollContainerRefs } from "./ScrollContainer";
import ScrollPaginationButtons from "./ScrollPaginationButtons";
import BookingCalendarTable from "./BookingCalendarTable";
import { BookingObjectsProvider } from "../context/BookingObjectsContext";
import MonthDropdown from "./MonthDropdown";
import { useSettings } from "@/hooks/useSettings";



const BookingCalendarContent: React.FC = () => {

  const { calendarSettings } = useSettings();
  const [visibleMonths, setVisibleMonths] = useState<VisibleMonthYear[]>([{ month: new Date().getMonth() + 1, year: new Date().getFullYear() }]);
  const [isTodayView, setIsTodayView] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const bookingCalendarWrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<ScrollContainerRefs>(null);

  const days = useMemo(() => {
    if (!calendarSettings.length || !calendarSettings[0].calendarRange) return [];
    return generateCalendarDays(calendarSettings[0].calendarRange);
  }, [calendarSettings]);

  const daysWithStatus = useMemo(() => {
    if (!days.length) return [];
    return preCalculateDaysStatusFlags(calendarSettings[0]?.bookingObjects, days);
  }, [days, calendarSettings]);

  const months = useMemo(() => {
    if (!days.length) return [];
    const monthMap = new Map();
    days.forEach(date => {
      const yearMonthKey = `${getYear(date)}-${getMonth(date)}`;
      const count = monthMap.get(yearMonthKey) || 0;
      monthMap.set(yearMonthKey, count + 1);
    });
    return Array.from(monthMap.entries()).map(([yearMonthKey, count]) => {
      const [year, month] = yearMonthKey.split('-').map(Number);
      return { year, month, count };
    });
  }, [days]);

  useEffect(() => {
    if (days.length) {
      setDayCountGlobalVar(days.length);
    }
  }, [days.length]);

  const updateVisibleMonthsAndYears = (months: VisibleMonthYear[]) => {
    setVisibleMonths(months);
  };

  const updateScrollState = (scrollLeft: number, scrollWidth: number, clientWidth: number) => {
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };


  const { bookingObjects } = calendarSettings[0];

  return (
    <div className="booking-calendar-wrapper w-full overflow-hidden animate-fadeIn relative" ref={bookingCalendarWrapperRef}>
      <BookingObjectsProvider bookingObjects={bookingObjects}>
        <div className="hidden lg:flex">
          <div className="flex flex-1 flex-row sm:justify-between items-center gap-2 ml-0 mr-2 w-max-full">
            <MonthDropdown scrollRef={scrollRef} months={months} />
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
        <div className="flex relative">
          <BookingObjectsTable bookingObjects={bookingObjects} />
          <ScrollPaginationButtons
            scrollRef={scrollRef}
            visibleMonths={visibleMonths}
            isTodayView={isTodayView}
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            calendarRange={calendarSettings[0]?.calendarRange}
            className="absolute top-0 right-0 z-10 m-0 py-0 bg-slate-100 lg:hidden"
          />
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
        <Legend />
      </BookingObjectsProvider>
    </div>
  );
};

const BookingCalendar: React.FC = () => {

  return (
    <BookingCalendarContent />
  );
};

export default BookingCalendar;
