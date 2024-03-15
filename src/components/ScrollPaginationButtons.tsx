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
import { CalendarRange } from "@/types";
import { isNextMonthWithinRange, isPrevMonthWithinRange } from "@/utils/dateUtils";

// Adjust the props interface to include a ref to the scroll container
interface ScrollPaginationProps {
  scrollRef: React.RefObject<ScrollContainerRefs>;
  visibleMonths: VisibleMonthYear[]; // Now an array of visible months and years
  isTodayView: boolean;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  calendarRange: CalendarRange;
}

interface VisibleMonthYear {
  month: number;
  year: number;
}


const ScrollPaginationButtons: React.FC<ScrollPaginationProps> = ({
  scrollRef,
  visibleMonths,
  isTodayView,
  canScrollLeft,
  canScrollRight,
  calendarRange
}) => {

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
    let nextYear = month === 12 ? year + 1 : year;
    let nextMonth = month === 12 ? 1 : month + 1;
    return { year: nextYear, month: nextMonth };
  };


  const getPrevMonth = (year: number, month: number) => {
    let prevYear = month === 1 ? year - 1 : year;
    let prevMonth = month === 1 ? 12 : month - 1;
    return { year: prevYear, month: prevMonth };
  };


  const scrollToNextMonth = () => {
    if (visibleMonths.length === 0) return;
    const lastVisibleMonth = visibleMonths[visibleMonths.length - 1];
    const { year, month } = getNextMonth(lastVisibleMonth.year, lastVisibleMonth.month);
    if (isNextMonthWithinRange(year, month, calendarRange)) {
      scrollRef.current?.scrollToMonth(year, month);
    }
    console.log('next month ' + month)
  };


  const scrollToPrevMonth = () => {
    if (visibleMonths.length === 0) return;
    const firstVisibleMonth = visibleMonths[0];
    const { year, month } = getPrevMonth(firstVisibleMonth.year, firstVisibleMonth.month);
    if (isPrevMonthWithinRange(year, month, calendarRange)) {
      scrollRef.current?.scrollToMonth(year, month);
    }
    console.log('prev month '+month)
  };


   // Assuming isNextMonthWithinRange and isPrevMonthWithinRange can accept the last or first month respectively.
  const prevDisabled = () => visibleMonths.length === 0 || !canScrollLeft;
  const nextDisabled = () => visibleMonths.length === 0 || !canScrollRight;

  return (
    <div className="py-2 flex justify-end items-center gap-2 mr-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="sm" onClick={scrollToPrevMonth} disabled={prevDisabled()}><FlowbiteChevronDoubleLeftSolid /></Button>
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
            <Button variant="secondary" size="sm" onClick={scrollToNextMonth} disabled={nextDisabled()}><FlowbiteChevronDoubleRightSolid /></Button>
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
