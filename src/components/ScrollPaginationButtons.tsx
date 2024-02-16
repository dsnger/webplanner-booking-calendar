import React from 'react';
import { ScrollContainerRefs } from "./BookingCalendarScrollContainer";

// Adjust the props interface to include a ref to the scroll container
interface ScrollPaginationProps {
  scrollRef: React.RefObject<ScrollContainerRefs>;
}

const ScrollPaginationButtons: React.FC<ScrollPaginationProps> = ({ scrollRef }) => {

  const scrollToCurrentDay = () => {
    scrollRef.current?.scrollToCurrentDay();
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollLeft();
  };

  const scrollRight = () => {
    scrollRef.current?.scrollRight();
  };

  return (
    <div className="py-2 flex justify-end items-center">
      <button onClick={scrollLeft} className="mx-2 p-1 border border-gray-300 rounded">&lt;</button>
      <button onClick={scrollToCurrentDay} className="mx-2 p-1 border border-gray-300 rounded">Today</button>
      <button onClick={scrollRight} className="mx-2 p-1 border border-gray-300 rounded">&gt;</button>
    </div>
  );
};

export default ScrollPaginationButtons;
