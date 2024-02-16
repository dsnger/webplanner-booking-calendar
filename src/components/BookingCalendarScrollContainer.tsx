import React, { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react';

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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);


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


  // Mouse down event
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft ?? 0));
    setScrollLeftStart(scrollContainerRef.current?.scrollLeft ?? 0);
    document.body.style.userSelect = 'none'; // Disable text selection while dragging
    scrollContainerRef.current?.classList.add('grabbing');
  };

  // Mouse move event (no changes needed for cursor here, but included for context)
  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft ?? 0);
    const walk = (x - startX) * 1; // Adjust scrolling speed here
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeftStart - walk;
    }
  };

  // Mouse up event
  const onMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = ''; // Re-enable text selection
    scrollContainerRef.current?.classList.remove('grabbing');
  };



  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, startX, scrollLeftStart]);


  return (
    <div ref={scrollParentRef} className="w-full max-w-5xl">
      <div
        ref={scrollContainerRef}
        onMouseDown={onMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'unset' }}
        className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-900 pb-3"
      >
        {children}
      </div>
    </div>
  );
});

export default BookingCalendarScrollContainer;
