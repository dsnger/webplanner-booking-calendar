import React, { useEffect, useCallback, useState } from 'react';
import RangeMarkerSVG from './RangeMarkerSVG';
import { useDays } from '@/hooks/useDays';
import { useSettings } from '@/hooks/useSettings';
import { useSelectedDates } from "@/hooks/useSelectedDates";
import { differenceInCalendarDays } from 'date-fns';
import { useRefs } from "@/hooks/useRefs";

const DynamicRange: React.FC = () => {
  const { scrollContainerRef } = useRefs();
  const { selectedStartDate, isSelecting } = useSelectedDates();
  const { days } = useDays();
  const { calendarSettings } = useSettings();
  const cellWidth = parseFloat(calendarSettings[0].cellSettings.cellWidth);
  const cellGap = parseFloat(calendarSettings[0].cellSettings.cellGap);
  const [currentEndDate, setCurrentEndDate] = useState<Date | null>(null);



  // Ensure the initial selection spans two cell widths
  // let initialEndDateIndex = days.findIndex(day => differenceInCalendarDays(day, selectedStartDate.date!) === 0) + 1;
  // if (initialEndDateIndex >= days.length) {
  //   initialEndDateIndex = days.length - 1;
  // }

  const getXPositionRelativeToContainer = (event: MouseEvent): number => {
    const container = scrollContainerRef.current?.element;
    if (container) {
      const boundingRect = container.getBoundingClientRect();
      return event.clientX - boundingRect.left + container.scrollLeft;
    }
    return 0;
  };


  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isSelecting || selectedStartDate.columnIndex === null) return;
    const xPos = getXPositionRelativeToContainer(e);
    const currentColumnIndex = Math.floor(xPos / (cellWidth + cellGap));
    const startIndex = selectedStartDate.columnIndex;

    const effectiveColumnIndex = Math.max(currentColumnIndex, startIndex);

    // console.log(getXPositionRelativeToContainer(e));
    const currentDate = days[effectiveColumnIndex];
    if (currentDate) {
      setCurrentEndDate(currentDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellWidth, cellGap, days, isSelecting, selectedStartDate]);



  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);


  if (!selectedStartDate.date || selectedStartDate.rowIndex === null || selectedStartDate.columnIndex === null) {
    return null; // Only render if start date is selected and row index is valid
  }

  let initialEndDateIndex = selectedStartDate.columnIndex;
  if (initialEndDateIndex >= days.length) {
    initialEndDateIndex = days.length - 1;
  }
  const initialEndDate = days[initialEndDateIndex];



  return (
    <RangeMarkerSVG
      index={selectedStartDate.rowIndex}
      start={selectedStartDate.date}
      end={currentEndDate ? currentEndDate : initialEndDate}
      days={days}
      type="selected"
      isSelecting={isSelecting}
    />
  );
};

export default DynamicRange;
