import React from "react";
import { BookingObject } from "../types"; // Ensure this type matches your data structure
import BookingCalendarRangeMarker from "./BookingCalendarRangeMarker"; // Correct the import path as needed

interface BlockedRangesProps {
  bookingObjects: BookingObject[];
  days: Date[];
}

const BookingCalendarBlockedRanges: React.FC<BlockedRangesProps> = ({ bookingObjects, days }) => {
  const cellColCount = days.length;

  return (

      <div className="grid absolute top-0 left-0 bottom-0"
        style={{
          width: `calc(${cellColCount} * var(--cell-width))`,
          gridTemplateColumns: `repeat(${cellColCount}, 2fr)`,
        }}>

        {bookingObjects.map((bookingObject, rowIndex) =>
          bookingObject.blockedDateRanges.map((range, rangeIndex) => (
            <BookingCalendarRangeMarker
              key={`${rowIndex}-${rangeIndex}`}
              index={rowIndex}
              start={new Date(range.start)}
              end={new Date(range.end)}
              starthalf={range.starthalf}
              endhalf={range.endhalf}
              type={range.type}
              tooltip={range.tooltip}
              days={days}
            />
          ))
        )}
      </div>
  );
};

export default BookingCalendarBlockedRanges;
