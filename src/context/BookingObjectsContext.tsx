import React, { createContext, useContext} from 'react';
import { BookingObject } from "../types";

interface BookingObjectsContextType {
  bookingObjects: BookingObject[];
}

// Since we're not providing an initial value, use `null` as a workaround and assert the correct type
const BookingObjectsContext = createContext<BookingObjectsContextType | null>(null);

interface BookingObjectsProviderProps {
  bookingObjects: BookingObject[];
  children: React.ReactNode; // Explicitly type children if needed, but React.FC includes it by default
}

export const BookingObjectsProvider: React.FC<BookingObjectsProviderProps> = ({ bookingObjects, children }) => {
  return (
    <BookingObjectsContext.Provider value={{ bookingObjects }}>
      {children}
    </BookingObjectsContext.Provider>
  );
};

// Update the hook to handle the possibility of `null`
export const useBookingObjects = (): BookingObjectsContextType => {
  const context = useContext(BookingObjectsContext);
  if (context === null) {
    throw new Error('useBookingObjects must be used within a BookingObjectsProvider');
  }
  return context;
};
