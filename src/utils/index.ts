// dateUtils.ts
import { eachDayOfInterval, startOfMonth, endOfMonth, format } from 'date-fns';
import { de } from 'date-fns/locale';
import { BookingCalendarSettings } from "../types";



// Assuming you're using TypeScript, you might want to temporarily loosen the type for testing
export const fetchCalendarSettings = async (fewoOwnID:number, lang:string = 'de'): Promise<any> => {
  const apiUrl = `https://www.webplanner.de/tools/belegungsplanerapi.php?fewoOwnID=${fewoOwnID}&lang=${lang}&anfrage=3`;

  console.log("fetchCalendarSettings:", apiUrl);
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched data:", data);
    return data; // This will now be an array of posts
  } catch (error) {
    console.error("Failed to fetch calendar settings:", error);
    throw error;
  }
};






export const getDaysOfMonth = (year: number, month: number): Date[] => {
  return eachDayOfInterval({
    start: startOfMonth(new Date(year, month - 1)), // month is 0-indexed in JavaScript Dates
    end: endOfMonth(new Date(year, month - 1))
  });
};

export const getDayName = (date: Date): string => {
  return format(date, 'eee', { locale: de }); // 'eee' for short day name
};

export const getMonthName = (year:number,month: number): string => {
  return format(new Date(year, month, 1), 'MMMM', { locale: de }); // 'MMMM' for full month name, adjusted month index
};

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const isDayInRange = (date: Date, selectedDayStart: Date | null, selectedDayEnd: Date | null): boolean => {
  if (selectedDayStart && selectedDayEnd) {
    return date >= selectedDayStart && date <= selectedDayEnd;
  }
  return selectedDayStart ? date.getTime() === selectedDayStart.getTime() : false;
};

