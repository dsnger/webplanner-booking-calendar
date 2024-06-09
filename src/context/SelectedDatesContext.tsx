import { useRefs } from "@/hooks/useRefs";
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
  startSelection: (date: Date, rowIndex: number, columnIndex: number) => void;
  finalizeSelection: (date: Date, rowIndex: number, columnIndex: number) => void;
  // handleDayHover: (date: Date, rowIndex: number, columnIndex: number) => void;
  // hoveredDay: SelectedDateInfo;
  // resetHoveredDay: () => void;
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

  // const [hoveredDay, setHoveredDay] = useState<SelectedDateInfo>({
  //   date: null,
  //   rowIndex: null,
  //   columnIndex: null,
  // });

  const [isSelecting, setIsSelecting] = useState(false);
  const { bookingCalendarWrapperRef } = useRefs();

  const resetDates = useCallback(() => {
    setSelectedStartDate({ date: null, rowIndex: null, columnIndex: null });
    setSelectedEndDate({ date: null, rowIndex: null, columnIndex: null });
  }, []);

  const startSelection = useCallback((date: Date, rowIndex: number, columnIndex: number) => {
    resetDates();
    setSelectedStartDate({ date, rowIndex, columnIndex });
    setIsSelecting(true);
  }, [resetDates]);


  const finalizeSelection = (date: Date, rowIndex: number, columnIndex: number) => {
    setSelectedEndDate({ date, rowIndex, columnIndex });
    setIsSelecting(false);
  };


  // const resetHoveredDay = useCallback(() => {
  //   setHoveredDay({ date: null, rowIndex: null, columnIndex: null });
  // }, [])


  // const handleDayHover = useCallback((date: Date, rowIndex: number, columnIndex: number) => {
  //   if (isSelecting === false) {
  //     setHoveredDay({ date, rowIndex, columnIndex });
  //   } else {
  //     resetHoveredDay();
  //   }
  // },[resetHoveredDay,isSelecting]);


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
      isSelecting,
      startSelection,
      finalizeSelection,
      // handleDayHover,
      // hoveredDay,
      // resetHoveredDay
    }}>
      {children}
    </SelectedDatesContext.Provider>
  );
};


export default SelectedDatesContext
