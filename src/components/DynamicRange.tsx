import React, { useEffect, useCallback, useState } from 'react';
import RangeMarkerSVG from './RangeMarkerSVG';
import { useDays } from '@/hooks/useDays';
import { useSettings } from '@/hooks/useSettings';
import { useSelectedDates } from "@/hooks/useSelectedDates";
import { useRefs } from "@/hooks/useRefs";

const DynamicRange: React.FC = () => {
  const { scrollContainerRef } = useRefs();
  const { selectedStartDate, isSelecting } = useSelectedDates();
  const { days } = useDays();
  const { calendarSettings } = useSettings();
  const cellWidth = parseFloat(calendarSettings[0].cellSettings.cellWidth);
  const cellGap = parseFloat(calendarSettings[0].cellSettings.cellGap);
  const [currentEndDate, setCurrentEndDate] = useState<Date | null>(null);

  // Added useEffect to reset currentEndDate when selectedStartDate changes
  useEffect(() => {
    if (selectedStartDate.date) {
      setCurrentEndDate(null);
    }
  }, [selectedStartDate]);

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
