import React, { useEffect, useCallback } from 'react';
import RangeMarkerSVG from './RangeMarkerSVG';
import { useDays } from '@/hooks/useDays';
import { useSettings } from '@/hooks/useSettings';
import { useSelectedDates } from "@/hooks/useSelectedDates";
import { differenceInCalendarDays } from 'date-fns';
import { useRefs } from "@/hooks/useRefs";

const DynamicRange: React.FC = () => {
  const { scrollContainerRef } = useRefs();
  const { selectedStartDate} = useSelectedDates();
  const { days } = useDays();
  const { calendarSettings } = useSettings();
  const cellWidth = parseFloat(calendarSettings[0].cellSettings.cellWidth);
  const cellGap = parseFloat(calendarSettings[0].cellSettings.cellGap);


  // Ensure the initial selection spans two cell widths
  let initialEndDateIndex = days.findIndex(day => differenceInCalendarDays(day, selectedStartDate.date!) === 0) + 1;
  if (initialEndDateIndex >= days.length) {
    initialEndDateIndex = days.length - 1;
  }
  const initialEndDate = days[initialEndDateIndex];

  const getXPositionRelativeToContainer = (event: MouseEvent): number => {
    const container = scrollContainerRef.current;
    console.log(container)
    if (container && container.getBoundingClientRect) { // Ensure container is an HTML element
      const boundingRect = container.getBoundingClientRect();
      console.log(boundingRect)
      return event.clientX - boundingRect.left + container.scrollLeft;
    }
    return 0;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const xPos = getXPositionRelativeToContainer(e);
    const currentColumnIndex = Math.floor(xPos / (cellWidth + cellGap));
    // console.log('currentColumnIndex:', currentColumnIndex);
    // console.log(getXPositionRelativeToContainer(e))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellWidth, cellGap, days]);


  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);


  if (!selectedStartDate.date || selectedStartDate.rowIndex === null) {
    return null; // Only render if start date is selected and row index is valid
  }


  return (
    <RangeMarkerSVG
      index={selectedStartDate.rowIndex}
      start={selectedStartDate.date}
      end={initialEndDate}
      days={days}
      type="selected"
    />
  );
};

export default DynamicRange;
