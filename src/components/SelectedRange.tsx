import React from 'react';
import RangeMarkerSVG from './RangeMarkerSVG';
import { useDays } from '@/hooks/useDays';
import { useSelectedDates } from "@/hooks/useSelectedDates";

const SelectedRange: React.FC = () => {
  const { selectedStartDate, selectedEndDate } = useSelectedDates();
  const { days } = useDays();

  if (
    !selectedStartDate.date ||
    !selectedEndDate.date ||
    selectedStartDate.rowIndex === null ||
    selectedEndDate.rowIndex === null ||
    selectedStartDate.rowIndex !== selectedEndDate.rowIndex
  ) {
    return null; // Only render if both dates are selected, they have row indexes, and they are in the same row
  }

  return (
    <RangeMarkerSVG
      index={selectedStartDate.rowIndex}
      start={selectedStartDate.date}
      end={selectedEndDate.date}
      days={days}
      type="selected" // You can use a custom type for styling if needed
    />
  );
};

export default SelectedRange;
