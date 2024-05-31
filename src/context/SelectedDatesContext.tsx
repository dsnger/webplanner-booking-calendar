import React, { createContext, useState, ReactNode, useCallback } from 'react';

interface SelectedDateInfo {
  date: Date | null;
  rowIndex: number | null;
  columnIndex: number | null;
}

interface SelectedDatesContextType {
  selectedStartDate: SelectedDateInfo;
  selectedEndDate: SelectedDateInfo;
  tempEndDate: SelectedDateInfo;
  setSelectedStartDate: (info: SelectedDateInfo) => void;
  setSelectedEndDate: (info: SelectedDateInfo) => void;
  resetDates: () => void;
  startSelection: (date: Date, rowIndex: number, columnIndex: number) => void;
  updateTempSelection: (date: Date, columnIndex: number) => void;
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
  const [tempEndDate, setTempEndDate] = useState<SelectedDateInfo>({
    date: null,
    rowIndex: null,
    columnIndex: null,
  });

  const resetDates = useCallback(() => {
    setSelectedStartDate({ date: null, rowIndex: null, columnIndex: null });
    setSelectedEndDate({ date: null, rowIndex: null, columnIndex: null });
    setTempEndDate({ date: null, rowIndex: null, columnIndex: null });
  }, []);

  const startSelection = useCallback((date: Date, rowIndex: number, columnIndex: number) => {
    resetDates();
    setSelectedStartDate({ date, rowIndex, columnIndex });
    setTempEndDate({ date, rowIndex, columnIndex });
  }, [resetDates]);

  const updateTempSelection = useCallback((date: Date, columnIndex: number) => {
    setTempEndDate((prev) => ({ ...prev, date, columnIndex }));
  }, []);

  const finalizeSelection = useCallback((date: Date, rowIndex: number, columnIndex: number) => {
    if (selectedStartDate.rowIndex === rowIndex && selectedStartDate.date && date > selectedStartDate.date) {
      setSelectedEndDate({ date, rowIndex, columnIndex });
    }
  }, [selectedStartDate]);

  return (
    <SelectedDatesContext.Provider value={{
      selectedStartDate,
      selectedEndDate,
      tempEndDate,
      setSelectedStartDate,
      setSelectedEndDate,
      resetDates,
      startSelection,
      updateTempSelection,
      finalizeSelection
    }}>
      {children}
    </SelectedDatesContext.Provider>
  );
};


export default SelectedDatesContext
