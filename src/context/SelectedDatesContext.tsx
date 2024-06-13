import { useDays } from "@/hooks/useDays";
import { useRefs } from "@/hooks/useRefs";
import { eachDayOfInterval, isAfter, isBefore } from "date-fns";
import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';

interface SelectedDateInfo {
  date: Date | null;
  rowIndex: number | null;
  columnIndex: number | null;
}

interface SelectedDatesContextType {
  selectedStartDate: SelectedDateInfo;
  selectedEndDate: SelectedDateInfo;
  setSelectedStartDate: (info: SelectedDateInfo) => void;
  setSelectedEndDate: (info: SelectedDateInfo) => void;
  resetDates: () => void;
  isSelecting: boolean;
  finalizedSelection: boolean;
  startSelection: (date: Date, rowIndex: number, columnIndex: number) => void;
  finalizeSelection: (date: Date, rowIndex: number, columnIndex: number) => void;
}

const SelectedDatesContext = createContext<SelectedDatesContextType | undefined>(undefined);

export const SelectedDatesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedStartDate, setSelectedStartDate] = useState<SelectedDateInfo>({
    date: null,
    rowIndex: null,
    columnIndex: null,
  });

  const [selectedEndDate, setSelectedEndDate] = useState<SelectedDateInfo>({
    date: null,
    rowIndex: null,
    columnIndex: null,
  });

  const [isSelecting, setIsSelecting] = useState(false);
  const [finalizedSelection, setFinalizedSelection] = useState(false);
  const { bookingCalendarWrapperRef } = useRefs();
  const { days, daysWithStatus } = useDays();


  const resetDates = useCallback(() => {
    setIsSelecting(false);
    setFinalizedSelection(false);
    setSelectedStartDate({ date: null, rowIndex: null, columnIndex: null });
    setSelectedEndDate({ date: null, rowIndex: null, columnIndex: null });
  }, []);


  const startSelection = useCallback((date: Date, rowIndex: number, columnIndex: number) => {
    resetDates();
    setSelectedStartDate({ date, rowIndex, columnIndex });
    setIsSelecting(true);
  }, [resetDates]);


  const finalizeSelection = useCallback((date: Date, rowIndex: number, columnIndex: number) => {
    if (!selectedStartDate.date) return;

    const interval = eachDayOfInterval({
      start: isBefore(selectedStartDate.date, date) ? selectedStartDate.date : date,
      end: isAfter(selectedStartDate.date, date) ? selectedStartDate.date : date
    });

    const isBlocked = interval.some(day => {
      const dayStatus = daysWithStatus[rowIndex]?.[days.findIndex(d => d.getTime() === day.getTime())];
      return dayStatus?.isUnavailable;
    });

    if (isBlocked) {
      resetDates();
    } else {
      setSelectedEndDate({ date, rowIndex, columnIndex });
      setFinalizedSelection(true);
    }

    setIsSelecting(false);
  }, [selectedStartDate, days, daysWithStatus, resetDates]);

  
  useEffect(() => {

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        bookingCalendarWrapperRef.current &&
        !bookingCalendarWrapperRef.current.contains(event.target as Node)
      ) {
        resetDates();
      }
    };

    // Attach the mousedown listener to the whole document
    document.addEventListener('mousedown', handleOutsideClick);

    // Cleanup function to remove both event listeners
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [bookingCalendarWrapperRef,resetDates]);


  return (
    <SelectedDatesContext.Provider value={{
      selectedStartDate,
      selectedEndDate,
      setSelectedStartDate,
      setSelectedEndDate,
      resetDates,
      finalizedSelection,
      isSelecting,
      startSelection,
      finalizeSelection,
    }}>
      {children}
    </SelectedDatesContext.Provider>
  );
};


export default SelectedDatesContext
