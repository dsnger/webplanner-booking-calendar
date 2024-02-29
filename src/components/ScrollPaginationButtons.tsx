import React from 'react';
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
  updateVisibleMonthAndYear: (month: number, year: number) => void;
}

const ScrollPaginationButtons: React.FC<ScrollPaginationProps> = ({
  scrollRef,
  visibleMonth,
  visibleYear,
  updateVisibleMonthAndYear,
}) => {

  const scrollToCurrentDay = () => {
    scrollRef.current?.scrollToCurrentDay();
  };

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
    updateVisibleMonthAndYear(month, year); // Update the visible month and year state
  };

  const scrollToPrevMonth = () => {
    const { year, month } = getPrevMonth(visibleYear, visibleMonth);
    scrollRef.current?.scrollToMonth(year, month);
    updateVisibleMonthAndYear(month, year); // Update the visible month and year state
  };

  return (
    <div className="py-2 flex justify-end items-center gap-2 mr-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={scrollToPrevMonth} ><FlowbiteChevronDoubleLeftSolid /></Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Vorheriger Monat</p>
          </TooltipContent>
        </Tooltip>

        <Button variant="outline" size="sm" onClick={scrollLeft} ><FlowbiteChevronLeftSolid /></Button>
        <Button variant="outline" size="sm" onClick={scrollToCurrentDay} >Heute</Button>
        <Button variant="outline" size="sm" onClick={scrollRight} ><FlowbiteChevronRightSolid /></Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={scrollToNextMonth} ><FlowbiteChevronDoubleRightSolid /></Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Nächster Monat</p>
          </TooltipContent>
        </Tooltip>

      </TooltipProvider>
    </div>
  );
};

export default ScrollPaginationButtons;
