import React, { createContext, useRef } from 'react';

interface RefsContextProps {
  bookingCalendarWrapperRef: React.RefObject<HTMLDivElement>;
  scrollContainerRef: React.RefObject<HTMLDivElement>; // Ensure this is an HTMLDivElement
}

const RefsContext = createContext<RefsContextProps | undefined>(undefined);

export const RefsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const bookingCalendarWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <RefsContext.Provider value={{ bookingCalendarWrapperRef, scrollContainerRef }}>
      {children}
    </RefsContext.Provider>
  );
};


export default RefsContext
