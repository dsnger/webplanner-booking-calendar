import React from 'react';
import { endOfDay, endOfMonth, format, getDay, isBefore, isLastDayOfMonth, isSameDay } from 'date-fns'; // Assuming you're using date-fns
import { getDayName, getMonthName } from "../utils/dateUtils";

// Props type definition
interface BookingCalendarTableHeadProps {
  months: { year: number; month: number; count: number }[];
  days: Date[];
  currentDate: Date;
}

const BookingCalendarTableHead: React.FC<BookingCalendarTableHeadProps> = ({ months, days, currentDate }) => {
  return (
    <thead>
      <tr className="border-t-0">
        {months.map(({ month, count, year }, index) => {
            // Create a Date object for the first day of the month
            const firstDayOfMonth = new Date(year, month, 1);
            // Use endOfMonth to get the last day of the month, then endOfDay for the very end of that day
            const lastMomentOfMonth = endOfDay(endOfMonth(firstDayOfMonth));
            // Check if the last moment of the month is before the current date and time
            const isInPast = isBefore(lastMomentOfMonth, new Date());
          return (
            <th id={`month-${year}-${month + 1}`} key={index} colSpan={count} className={`p-1 h-10 border-t-0 border-b-4 border-r-2 border-l-2 border-white bg-slate-100 text-left md:text-center${isInPast ? ' opacity-30' : ''}`}>
              <div className="sticky left-3 inline-block text-sm ">{getMonthName(year, month)} {year}</div>
            </th>
          )
        })}
      </tr>
      <tr>
        {days.map((date, index) => {
          const isInPast = isBefore(endOfDay(date), new Date());
          return (
            <th
              key={date.toISOString()}
              className={ `border-l border-r border-b-4 border-white p-1${index === 0 ? ' first-of-month border-l-2 border-white' : ' '}${isLastDayOfMonth(date) ? 'last-of-month border-r-2 border-white' : ' '}${getDay(date) === 0 && !isSameDay(date, currentDate) ? ' text-red-500 bg-red-100/40' : ' '}${isSameDay(date, currentDate) ? 'text-green-600 bg-green-100/60 is-today' : ' '}${isInPast ? ' opacity-30' : ''}`}
              id={isSameDay(date, currentDate) ? 'isToday' : ' '}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-xs font-light block">{getDayName(date)}</span>
                <span className="text-xs block">{format(date, 'd')}</span>
              </div>
            </th>
          )
        }
        )}
      </tr>
    </thead>
  );
};

export default BookingCalendarTableHead;
