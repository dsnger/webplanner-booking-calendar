import React from 'react';
import { differenceInCalendarDays } from 'date-fns';

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

const RangeMarker: React.FC<RangeMarkerProps> = ({ index, start, end, tooltip, days }) => {
  const getColumnStart = (date: Date) => days.findIndex(day => differenceInCalendarDays(day, date) === 0) + 1;
  const getColumnEnd = (date: Date) => days.findIndex(day => differenceInCalendarDays(day, date) === 0) + 2; // End day is inclusive

  return (
    <div className="h-cell-height"
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

export default RangeMarker;
