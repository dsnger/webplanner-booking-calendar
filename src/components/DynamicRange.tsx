import React, { useEffect, useCallback, useState } from 'react';
import RangeMarkerSVG from './RangeMarkerSVG';
import { useDays } from '@/hooks/useDays';
import { useSettings } from '@/hooks/useSettings';
import { useSelectedDates } from "@/hooks/useSelectedDates";
import { useRefs } from "@/hooks/useRefs";
import { eachDayOfInterval, isAfter, isBefore } from "date-fns";

const DynamicRange: React.FC = () => {
  const { scrollContainerRef } = useRefs();
  const { bookingCalendarWrapperRef } = useRefs();
  const { selectedStartDate, isSelecting} = useSelectedDates();
  const { days, daysWithStatus } = useDays();
  const { calendarSettings } = useSettings();
  const cellWidth = parseFloat(calendarSettings[0].cellSettings.cellWidth);
  const cellGap = parseFloat(calendarSettings[0].cellSettings.cellGap);
  const [currentEndDate, setCurrentEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        bookingCalendarWrapperRef.current &&
        !bookingCalendarWrapperRef.current.contains(event.target as Node)
      ) {
        setCurrentEndDate(null);
      }
    };

    const handleDayClick = (event: MouseEvent) => {
      if (isSelecting ) return;

      if (
        bookingCalendarWrapperRef.current &&
        bookingCalendarWrapperRef.current.contains(event.target as Node)
      ) {
        setCurrentEndDate(null);
        selectedStartDate.date = null
      }
    };

    // Attach the mousedown listener to the whole document
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('mousedown', handleDayClick);

    // Cleanup function to remove both event listeners
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('mousedown', handleDayClick);
    };
  }, [bookingCalendarWrapperRef, setCurrentEndDate, isSelecting, selectedStartDate]);



  const handleMouseMove = useCallback((e: MouseEvent) => {

    const getXPositionRelativeToContainer = (event: MouseEvent): number => {
      const container = scrollContainerRef.current?.element;
      if (container) {
        const boundingRect = container.getBoundingClientRect();
        return event.clientX - boundingRect.left + container.scrollLeft;
      }
      return 0;
    };

    if (!isSelecting || selectedStartDate.columnIndex === null || !selectedStartDate.date || selectedStartDate.rowIndex === null) return;

    const xPos = getXPositionRelativeToContainer(e);
    const currentColumnIndex = Math.floor(xPos / (cellWidth + cellGap));
    const startIndex = selectedStartDate.columnIndex;
    const effectiveColumnIndex = Math.max(currentColumnIndex, startIndex);

    const currentDate = days[effectiveColumnIndex];
    if (currentDate) {
      const interval = eachDayOfInterval({
        start: isBefore(selectedStartDate.date, currentDate) ? selectedStartDate.date : currentDate,
        end: isAfter(selectedStartDate.date, currentDate) ? selectedStartDate.date : currentDate
      });

      const isBlocked = interval.some(day => {
        const dayIndex = days.findIndex(d => d.getTime() === day.getTime());
        if (dayIndex === -1 || selectedStartDate.rowIndex === null) return false;
        return daysWithStatus[selectedStartDate.rowIndex]?.[dayIndex]?.isUnavailable ?? false;
      });

      if (!isBlocked) {
        setCurrentEndDate(currentDate);
      }
    }
  }, [scrollContainerRef, cellWidth, cellGap, days, isSelecting, selectedStartDate, daysWithStatus]);

  //Added useEffect to reset currentEndDate when selectedStartDate changes
  useEffect(() => {
    if (selectedStartDate.date) {
      setCurrentEndDate(null);
    }
  }, [selectedStartDate]);


  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);


  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        bookingCalendarWrapperRef.current &&
        !bookingCalendarWrapperRef.current.contains(event.target as Node)
      ) {
        setCurrentEndDate(null);
      }
    };

    // Attach the mousedown listener to the whole document
    document.addEventListener('mousedown', handleOutsideClick);
    // Cleanup function to remove both event listeners
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [bookingCalendarWrapperRef, setCurrentEndDate]);


  // Determine the start and end dates based on selection or hover state
  let startDate: Date | null = null;
  let endDate: Date | null = null;
  let rowIndex: number | null = null;

  if (selectedStartDate.date && selectedStartDate.rowIndex !== null && selectedStartDate.columnIndex !== null) {
    startDate = selectedStartDate.date;
    rowIndex = selectedStartDate.rowIndex;
    endDate = currentEndDate;

    if (!endDate || endDate <= startDate) {
      let initialEndDateIndex = selectedStartDate.columnIndex;
      if (initialEndDateIndex >= days.length) {
        initialEndDateIndex = days.length - 1;
      }
      endDate = days[initialEndDateIndex + 1];
    }
  }

  if (!startDate || !endDate || rowIndex === null) {
    return null;
  }

  return (
    <RangeMarkerSVG
      index={rowIndex}
      start={startDate}
      end={endDate}
      starthalf={true}
      endhalf={true}
      days={days}
      type="selected"
      isSelecting={isSelecting}
    />
  );
};

export default DynamicRange;
