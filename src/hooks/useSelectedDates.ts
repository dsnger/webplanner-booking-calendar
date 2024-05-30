import SelectedDatesContext from "@/context/SelectedDatesContext";
import { useContext } from "react";

export const useSelectedDates = () => {
  const context = useContext(SelectedDatesContext);
  if (!context) {
    throw new Error('useSelectedDates must be used within a SelectedDatesProvider');
  }
  return context;
};
