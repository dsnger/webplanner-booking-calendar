import { ScrollContainerRefs, VisibleMonthYear } from "@/types";
import { calculateMostVisibleMonths, isElementInViewport } from "@/utils/scrollUtils";
import React, { forwardRef, useRef, useImperativeHandle, useEffect, useCallback } from 'react';

type BookingCalendarScrollContainerProps = {
  children: React.ReactNode;
  updateVisibleMonthsAndYears: (months: VisibleMonthYear[]) => void;
  updateIsTodayView: (isTodayView: boolean) => void;
  updateScrollState: (scrollLeft: number, scrollWidth: number, clientWidth: number) => void;
};

const BookingCalendarScrollContainer = forwardRef<ScrollContainerRefs & { element: HTMLDivElement | null }, BookingCalendarScrollContainerProps>(
  ({ children, updateVisibleMonthsAndYears, updateIsTodayView, updateScrollState }, ref) => {
    const scrollParentRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollToToday = useCallback(() => {
      const dayElement = scrollContainerRef.current?.querySelector('#isToday');
      if (dayElement) {
        console.log(dayElement)
        dayElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, []);


    const handleUpdate = useCallback((container: HTMLElement) => {
      const { months } = calculateMostVisibleMonths(container);
      if (months.length > 0) {
        updateVisibleMonthsAndYears(months);
      }
    }, [updateVisibleMonthsAndYears]);


    const handleScroll = useCallback(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      handleUpdate(container);

      const dayElement = container.querySelector('#isToday') as HTMLElement | null;
      if (dayElement && isElementInViewport(dayElement, container)) {
        updateIsTodayView(true);
      } else {
        updateIsTodayView(false);
      }

      const { scrollLeft, scrollWidth, clientWidth } = container;
      updateScrollState(scrollLeft, scrollWidth, clientWidth);
    }, [handleUpdate, updateIsTodayView, updateScrollState]);


    useEffect(() => {
      // scrollToToday();
      const container = scrollContainerRef.current;
      if (container) {
        handleScroll();
      }
    }, [scrollToToday, handleScroll, handleUpdate]);


    useImperativeHandle(ref, () => ({
      scrollToCurrentDay: scrollToToday,
      scrollLeft: () => {
        if (scrollContainerRef.current && scrollParentRef.current) {
          const newScrollPosition = -scrollParentRef.current.offsetWidth / 2;
          scrollContainerRef.current.scrollBy({ left: newScrollPosition, behavior: 'smooth' });
        }
      },
      scrollRight: () => {
        if (scrollContainerRef.current && scrollParentRef.current) {
          const newScrollPosition = scrollParentRef.current.offsetWidth / 2;
          scrollContainerRef.current.scrollBy({ left: newScrollPosition, behavior: 'smooth' });
        }
      },
      scrollToMonth: (year, month) => {
        const monthStartElem = document.getElementById(`month-${year}-${month}`);
        if (monthStartElem) {
          monthStartElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      },
      get element() {
        return scrollContainerRef.current;
      }
    }));

    return (
      <div ref={scrollParentRef} className="flex-1 w-1/2">
        <div
          className="overflow-x-auto scrollbar-hide relative"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {children}
        </div>
      </div>
    );
  }
);

export default BookingCalendarScrollContainer;
