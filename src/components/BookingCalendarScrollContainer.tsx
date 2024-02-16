import React, { forwardRef, useRef, useImperativeHandle } from 'react';

type BookingCalendarScrollContainerProps = {
  children: React.ReactNode;
};


export type ScrollContainerRefs = {
  scrollToCurrentDay: () => void;
  scrollLeft: () => void;
  scrollRight: () => void;
  scrollToMonth: (year: number, month: number) => void;
};

const BookingCalendarScrollContainer = forwardRef<ScrollContainerRefs, BookingCalendarScrollContainerProps>(({ children }, ref) => {
  const scrollParentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({

    scrollToCurrentDay: () => {
      if (scrollContainerRef.current) {
        const dayElement = scrollContainerRef.current.querySelector('#isToday');
        if (dayElement) {
          dayElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
      }
    },
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


  return (
    <div ref={scrollParentRef} className="w-full max-w-5xl">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-900 pb-3" ref={scrollContainerRef}>
        {children}
      </div>
    </div>
  );
});

export default BookingCalendarScrollContainer;
