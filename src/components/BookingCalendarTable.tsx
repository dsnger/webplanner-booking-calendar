import React from 'react';
import BookingCalendarTableHead from './BookingCalendarTableHead';
import BookingCalendarTableBody from './BookingCalendarTableBody';
import { BookingObject, DayStatus } from "../types";

// Assuming types for your props are defined elsewhere and imported accordingly
interface BookingCalendarTableProps {
  months: { year: number; month: number; count: number }[];
  days: Date[];
  bookingObjects: BookingObject[];
  daysWithStatus: DayStatus[][];
  currentDate: Date;
}


const BookingCalendarTable: React.FC<BookingCalendarTableProps> = ({
  months,
  days,
  daysWithStatus,
  bookingObjects,
  currentDate,
}) => (
  <table className="min-w-full">
    <BookingCalendarTableHead
      months={months}
      days={days}
      currentDate={currentDate}
    />
    <BookingCalendarTableBody
      bookingObjects={bookingObjects}
      days={days}
      daysWithStatus={daysWithStatus}
      currentDate={currentDate}
    />
  </table>
);

export default BookingCalendarTable;
