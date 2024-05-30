import React, { createContext, useState, ReactNode, useCallback } from 'react';

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
  handleDayClick: (date: Date, type: 'arrival' | 'departure', rowIndex: number, columnIndex: number) => void;
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

  const resetDates = useCallback(() => {
    setSelectedStartDate({ date: null, rowIndex: null, columnIndex: null });
    setSelectedEndDate({ date: null, rowIndex: null, columnIndex: null });
  }, []);

  const handleDayClick = useCallback((date: Date, type: 'arrival' | 'departure', rowIndex: number, columnIndex: number) => {
    if (type === 'arrival') {
      // Start a new selection with the clicked arrival day
      resetDates();
      setSelectedStartDate({ date, rowIndex, columnIndex });
    } else if (type === 'departure') {
      // End selection with the clicked departure day if in the same row
      if (selectedStartDate.rowIndex === rowIndex && selectedStartDate.date && date > selectedStartDate.date) {
        setSelectedEndDate({ date, rowIndex, columnIndex });
      }
    }
  }, [selectedStartDate, resetDates]);

  return (
    <SelectedDatesContext.Provider value={{ selectedStartDate, setSelectedStartDate, selectedEndDate, setSelectedEndDate, resetDates, handleDayClick }}>
      {children}
    </SelectedDatesContext.Provider>
  );
};

export default SelectedDatesContext