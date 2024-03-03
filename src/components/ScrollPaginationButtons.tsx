import React, { useEffect } from 'react';
import { ScrollContainerRefs } from "./BookingCalendarScrollContainer";
import { Button } from "./ui/button"
import { FlowbiteChevronDoubleLeftSolid, FlowbiteChevronDoubleRightSolid, FlowbiteChevronLeftSolid, FlowbiteChevronRightSolid } from "./icons/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

// Adjust the props interface to include a ref to the scroll container
interface ScrollPaginationProps {
  scrollRef: React.RefObject<ScrollContainerRefs>;
  visibleMonth: number;
  visibleYear: number;
  isTodayView: boolean;
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

const ScrollPaginationButtons: React.FC<ScrollPaginationProps> = ({
  scrollRef,
  visibleMonth,
  visibleYear,
  isTodayView,
  canScrollLeft,
  canScrollRight
}) => {

  useEffect(() => { 
    scrollRef.current?.scrollToCurrentDay();
  }, []);

  const scrollToCurrentDay = () => {
    scrollRef.current?.scrollToCurrentDay();
  }

  const scrollLeft = () => {
    scrollRef.current?.scrollLeft();
  };

  const scrollRight = () => {
    scrollRef.current?.scrollRight();
  };

  const getNextMonth = (year: number, month: number) => {
    const nextMonth = new Date(year, month, 0); // Getting the last day of the current month
    return { year: nextMonth.getFullYear(), month: nextMonth.getMonth() + 2 }; // JavaScript months are 0-indexed, adjust for next month
  };

  const getPrevMonth = (year: number, month: number) => {
    const prevMonth = new Date(year, month - 2, 1); // Setting to one month before the current month
    return { year: prevMonth.getFullYear(), month: prevMonth.getMonth() + 1 }; // Adjust for 0-indexed months
  };

  const scrollToNextMonth = () => {
    const { year, month } = getNextMonth(visibleYear, visibleMonth);
    scrollRef.current?.scrollToMonth(year, month);
  };

  const scrollToPrevMonth = () => {
    const { year, month } = getPrevMonth(visibleYear, visibleMonth);
    scrollRef.current?.scrollToMonth(year, month);
  };

  return (
    <div className="py-2 flex justify-end items-center gap-2 mr-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="sm" onClick={scrollToPrevMonth} disabled={!canScrollLeft}><FlowbiteChevronDoubleLeftSolid /></Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>vorheriger Monat</p>
          </TooltipContent>
        </Tooltip>

          
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="sm" onClick={scrollLeft} disabled={!canScrollLeft}><FlowbiteChevronLeftSolid /></Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>zurück</p>
          </TooltipContent>
        </Tooltip>
          
        <Button variant="secondary" size="sm" onClick={scrollToCurrentDay} disabled={isTodayView}>Heute</Button>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="sm" onClick={scrollRight} disabled={!canScrollRight}><FlowbiteChevronRightSolid /></Button>
            </TooltipTrigger>
          <TooltipContent>
            <p>vor</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="sm" onClick={scrollToNextMonth} disabled={!canScrollRight}><FlowbiteChevronDoubleRightSolid /></Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>nächster Monat</p>
          </TooltipContent>
        </Tooltip>

      </TooltipProvider>
    </div>
  );
};

export default ScrollPaginationButtons;
