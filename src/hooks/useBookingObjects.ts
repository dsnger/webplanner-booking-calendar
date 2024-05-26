import { useContext } from 'react';

import BookingObjectsContext from '@/context/BookingObjectsContext';
import { BookingObject } from "@/types";

interface BookingObjectsContextType {
  bookingObjects: BookingObject[];
}

// Update the hook to handle the possibility of `null`
export const useBookingObjects = (): BookingObjectsContextType => {
  const context = useContext(BookingObjectsContext);
  if (context === null) {
    throw new Error('useBookingObjects must be used within a BookingObjectsProvider');
  }
  return context;
};

