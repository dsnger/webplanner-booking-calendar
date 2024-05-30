import DaysContext from "@/context/DaysContext";
import { useContext } from 'react';

export const useDays = () => {
  const context = useContext(DaysContext);
  if (context === undefined) {
    throw new Error('useDays must be used within a DaysProvider');
  }
  return context;
};
