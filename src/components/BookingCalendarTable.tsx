import React from 'react';
import BookingCalendarTableHead from './BookingCalendarTableHead';
import BookingCalendarTableBody from './BookingCalendarTableBody';
import { BookingObject, CellCoordinates } from "../types";

// Assuming types for your props are defined elsewhere and imported accordingly
interface BookingCalendarTableProps {
  months: { year: number; month: number; count: number }[];
  days: Date[];
  bookingObjects: BookingObject[];
  selectedCell: CellCoordinates | null;
  currentDate: Date;
  cellClasses: { rowIndex: number; colIndex: number; classes: string[] }[];
}


const BookingCalendarTable: React.FC<BookingCalendarTableProps> = ({
  months,
  days,
  bookingObjects,
  selectedCell,
  currentDate,
  cellClasses,
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
      selectedCell={selectedCell}
      currentDate={currentDate}
      cellClasses={cellClasses}
    />
  </table>
);

export default BookingCalendarTable;
