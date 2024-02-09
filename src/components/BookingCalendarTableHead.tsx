import React from 'react';
import { format, getDay, isLastDayOfMonth, isSameDay } from 'date-fns'; // Assuming you're using date-fns
import { getDayName, getMonthName } from "../utils";

// Props type definition
interface BookingCalendarTableHeadProps {
  months: { year: number; month: number; count: number }[];
  days: Date[];
  currentDate: Date;
}

const BookingCalendarTableHead: React.FC<BookingCalendarTableHeadProps> = ({ months, days, currentDate }) => {
  return (
    <thead>
      <tr>
        {months.map(({ month, count, year }, index) => (
          <th key={index} colSpan={count} className="p-1 h-10 border border-r-2 border-l-2 border-gray-500">
            {getMonthName(year,month)} {year}
          </th>
        ))}
      </tr>
      <tr>
        {days.map((date, index) => (
          <th
            key={date.toISOString()}
            className={`cell cell-day-date border-l border-r border-b border-gray-500 p-1 ${index === 0 ? 'first-of-month' : ''} ${isLastDayOfMonth(date) ? 'last-of-month border-r-2' : ''} ${isSameDay(date, currentDate) ? 'bg-green-100/10 text-green-600 is-today' : ''} ${getDay(date) === 0 ? 'text-red-500 bg-red-100/10' : ''}`}
            id={isSameDay(date, currentDate) ? 'isToday' : ``}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-xs font-light block mb-1">{getDayName(date)}</span>
              <span className="text-xs block">{format(date, 'd')}</span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default BookingCalendarTableHead;
