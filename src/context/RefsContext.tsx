import React, { createContext, useRef } from 'react';
import { ScrollContainerRefs } from "@/types";

export interface RefsContextProps {
  bookingCalendarWrapperRef: React.RefObject<HTMLDivElement>;
  scrollContainerRef: React.RefObject<ScrollContainerRefs & { element: HTMLDivElement | null }>;
}

const RefsContext = createContext<RefsContextProps | undefined>(undefined);

export const RefsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const bookingCalendarWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<ScrollContainerRefs & { element: HTMLDivElement | null }>(null);

  return (
    <RefsContext.Provider value={{ bookingCalendarWrapperRef, scrollContainerRef }}>
      {children}
    </RefsContext.Provider>
  );
};

export default RefsContext;
