// dateUtils.ts
import { eachDayOfInterval, startOfMonth, endOfMonth, format } from 'date-fns';
import { de } from 'date-fns/locale';

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
