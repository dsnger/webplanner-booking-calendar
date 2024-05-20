import React from 'react';
import { differenceInCalendarDays, parseISO } from 'date-fns';

interface RangeMarkerProps {
  index: number;
  start: Date;
  end: Date;
  starthalf?: boolean;
  endhalf?: boolean;
  type?: string;
  tooltip?: string;
  days: Date[];
}

const BookingCalendarRangeMarker: React.FC<RangeMarkerProps> = ({ index, start, end, starthalf, endhalf, type, tooltip, days }) => {
  const getColumnStart = (date: Date) => days.findIndex(day => differenceInCalendarDays(day, date) === 0) + 1;
  const getColumnEnd = (date: Date) => days.findIndex(day => differenceInCalendarDays(day, date) === 0) + 2; // End day is inclusive

  return (
    <div className="h-9"
      style={{
        gridColumnStart: getColumnStart(start),
        gridColumnEnd: getColumnEnd(end),
        gridRow: index + 1,
        backgroundColor: '#f00', // Example styling, adjust as needed
      }}
    >
      {tooltip} {/* Optionally displaying the tooltip */}
    </div>
  );
};

export default BookingCalendarRangeMarker;
