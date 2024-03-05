import { calculateMostVisibleMonth, isElementInViewport } from "@/utils/scrollUtils";
import React, { forwardRef, useRef, useImperativeHandle, useEffect } from 'react';

type BookingCalendarScrollContainerProps = {
  children: React.ReactNode;
  updateVisibleMonthAndYear: (month: number, year: number) => void;
  updateIsTodayView: (isTodayView: boolean) => void;
  updateScrollState: (scrollLeft: number, scrollWidth: number, clientWidth: number) => void;
};


export type ScrollContainerRefs = {
  scrollToCurrentDay: () => void;
  scrollLeft: () => void;
  scrollRight: () => void;
  scrollToMonth: (year: number, month: number) => void;
};

const BookingCalendarScrollContainer = forwardRef<ScrollContainerRefs, BookingCalendarScrollContainerProps>(({ children, updateVisibleMonthAndYear, updateIsTodayView, updateScrollState }, ref) => {
  
  const scrollParentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);


  // Define a reusable function for scrolling
  const scrollToToday = () => {
    const dayElement = scrollContainerRef.current?.querySelector('#isToday');
    if (dayElement) {
      dayElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  };


  useEffect(() => {;
    scrollToToday();
  }, []);


  useImperativeHandle(ref, () => ({

    scrollToCurrentDay: scrollToToday,
    scrollLeft: () => {
      if (scrollContainerRef.current && scrollParentRef.current) {
        let newScrollPosition = -scrollParentRef.current.offsetWidth / 2; // Adjust the scroll step size as needed
        scrollContainerRef.current.scrollBy({ left: newScrollPosition, behavior: 'smooth' });
      }
    },
    scrollRight: () => {
      if (scrollContainerRef.current && scrollParentRef.current) {
        let newScrollPosition = scrollParentRef.current.offsetWidth / 2; // Adjust the scroll step size as needed
        scrollContainerRef.current.scrollBy({ left: newScrollPosition, behavior: 'smooth' });
      }
    },
    scrollToMonth: (year, month) => {
      const monthStartElem = document.getElementById(`month-${year}-${month}`);
      if (monthStartElem) {
        monthStartElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
   

  }));

  

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
  
    // Calculate the most visible month
    const { year, month } = calculateMostVisibleMonth(container);
    if (year && month) {
      updateVisibleMonthAndYear(month, year);
    }

    // Check if the 'dayElement' is in the viewport
    const dayElement = container.querySelector('#isToday') as HTMLElement | null;
    if (dayElement && isElementInViewport(dayElement, container)) {
      updateIsTodayView(true);
    } else {
      updateIsTodayView(false);
    }

    const { scrollLeft, scrollWidth, clientWidth } = container;
    updateScrollState(scrollLeft, scrollWidth, clientWidth);
  
  };
  


  return (
    <div
      ref={scrollParentRef}
      className="flex-1 w-1/2"
      >
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-900 pb-3"
        ref={scrollContainerRef}
        onScroll={handleScroll} 
        >
        {children}
      </div>
    </div>
  );
});

export default BookingCalendarScrollContainer;
