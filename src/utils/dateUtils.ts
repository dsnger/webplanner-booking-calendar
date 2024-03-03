// dateUtils.ts
import { eachDayOfInterval, startOfMonth, endOfMonth, format, parseISO, startOfYear, endOfYear, isSameDay, isWithinInterval } from 'date-fns';
import { de } from 'date-fns/locale';
import { BookingObject, CalendarRange, DateRangeType, DayStatus } from "../types";
// import { useBookingObjects } from "../context/BookingObjectsContext";



// const { bookingObjects } = useBookingObjects();


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


export const generateCalendarDays = (calendarRange: CalendarRange): Date[] => {
  const { startDate, endDate} = calendarRange;

  // Parse the start date or use the start of the current year if not provided
  let start = startDate ? parseISO(startDate) : startOfYear(new Date());
  let end;
  
  if (endDate) {
    // Parse the end date if provided
    end = parseISO(endDate);
  } else {
    // Default to end of the year if neither endDate nor duration is provided
    end = endOfYear(start);
  }

  const days = eachDayOfInterval({ start, end });
  // console.log(days)
  return days;
};



// const blockedRangeDatesLookup: { [key: string]: BlockedDateRangeInfo[] } = {};
 
const isBlockedDateRange = (
  bookingObject: BookingObject,
  date: Date
): {
    isUnavailable: boolean;
    type: DateRangeType | null;
    tooltip: string | null,
    isUnavailStart: boolean,
    isUnavailEnd: boolean

} => {
  
  let isUnavailable = false;
  let isUnavailStart = false;
  let isUnavailEnd = false;
  let rangeType: DateRangeType | null = null;
  let rangeTooltip: string | null = null;

  if (!bookingObject) {
    return {
      isUnavailable,
      type: null,
      tooltip: null,
      isUnavailStart,
      isUnavailEnd,
    };
  }

  bookingObject.blockedDateRanges?.find(range => {
    const startDay = new Date(range.start);
    const endDay = new Date(range.end);
    
    if (isSameDay(date, startDay)) {
      isUnavailStart = true; 
      rangeType = range.type as DateRangeType;
    }

    if (isSameDay(date, endDay)) {
      isUnavailEnd = true;  
      //rangeType = range.type as DateRangeType;
    }

    if (isWithinInterval(date, { start: startDay, end: endDay })) {
      isUnavailable = true;
      rangeType = range.type as DateRangeType;
      rangeTooltip = range.tooltip;
      return true;
    }

    return false; // Continue searching if none of the conditions are met
  });

  return {
    isUnavailable,
    type: rangeType,
    tooltip: rangeTooltip,
    isUnavailStart,
    isUnavailEnd,
  };
};



const isDateType = (bookingObject: BookingObject, date: Date, type: 'arrival' | 'departure'): boolean => {
  if (!bookingObject) {
    return false;
  }
  // Using a fallback to an empty array if dateStrings are undefined
  const dateStrings = type === 'arrival'
    ? bookingObject.dayTypes.arrivalDays.dates || []
    : bookingObject.dayTypes.departureDays.dates || [];

  return dateStrings.some(dateString => isSameDay(date, parseISO(dateString)));
};


const hasExclusiveDateTypes = (bookingObject: BookingObject, type: 'arrival' | 'departure'): boolean => {
  if (!bookingObject) {
    return false;
  }

  // Check for 'arrival' type
  if (type === 'arrival') {
    const isExclusive = bookingObject.dayTypes.arrivalDays.exclusive === true;
    // Optionally, check if dates array exists and has entries if needed
    const hasDates = bookingObject.dayTypes.arrivalDays.dates && bookingObject.dayTypes.arrivalDays.dates.length > 0;
    return isExclusive && hasDates; // Now requires both conditions to be true
  } 
  // Check for 'departure' type
  else if (type === 'departure') {
    const isExclusive = bookingObject.dayTypes.departureDays.exclusive === true;
    const hasDates = bookingObject.dayTypes.departureDays.dates && bookingObject.dayTypes.departureDays.dates.length > 0;
    return isExclusive && hasDates; // Now requires both conditions to be true
  }

  // Fallback in case the type doesn't match 'arrival' or 'departure'
  return false;
};




export const preCalculateDaysStatusFlags = (bookingObjects: BookingObject[], days: Date[]): DayStatus[][] => {
    return bookingObjects.map((bookingObject) => 
      days.map((day) => {

        const blockedInfo = isBlockedDateRange(bookingObject, day);
        const hasExclusiveArrivalDates = hasExclusiveDateTypes(bookingObject, 'arrival');
        const hasExclusiveDepartureDates = hasExclusiveDateTypes(bookingObject, 'arrival');
        const isArrivalDay = isDateType(bookingObject, day, 'arrival');
        const isDepartureDay = isDateType(bookingObject, day, 'departure');

        const isDisabled = (hasExclusiveDepartureDates && !isDepartureDay) || (hasExclusiveArrivalDates && !isArrivalDay);
     
        return {
          isUnavailable: blockedInfo.isUnavailable,
          type: blockedInfo.type,
          tooltip: blockedInfo.tooltip,
          isUnavailStart: blockedInfo.isUnavailStart,
          isUnavailEnd: blockedInfo.isUnavailEnd,
          isDisabled: isDisabled,
          isArrival: isDateType(bookingObject, day, 'arrival'),
          isDeparture: isDateType(bookingObject, day, 'departure'),
        };
      })
    );
};
  

