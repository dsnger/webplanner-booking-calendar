import React from "react";
import { BookingObject } from "../types"; // Ensure this type matches your data structure/ Correct the import path as needed
// import RangeMarker from "./RangeMarker";
import RangeMarkerSVG from "./RangeMarkerSVG";

interface BlockedRangesProps {
  bookingObjects: BookingObject[];
  days: Date[];
}

const BlockedRanges: React.FC<BlockedRangesProps> = ({ bookingObjects, days }) => {
  const cellColCount = days.length;

  console.log( bookingObjects)

  if (!Array.isArray(bookingObjects)) {
    console.error('bookingObjects is not an array:', bookingObjects);
    return <div>Invalid booking data</div>;
  }

  return (

      <div className="grid absolute top-0 left-0 bottom-0"
        style={{
          width: `calc(${cellColCount} * (var(--cell-width) + var(--cell-gap))`,
          gridTemplateColumns: `repeat(${cellColCount}, 2fr)`,
          gridTemplateRows: `repeat(${bookingObjects.length}, var(--cell-height))`,
          rowGap: `var(--cell-gap)`,
        }}>

        {bookingObjects.map((bookingObject, rowIndex) => {
        if (!bookingObject || !Array.isArray(bookingObject.blockedDateRanges)) {
          console.error(`Invalid bookingObject at index ${rowIndex}:`, bookingObject);
          return null;
        }

        return bookingObject.blockedDateRanges.map((range, rangeIndex) => {
          if (!range) {
            console.error(`Invalid range at index ${rangeIndex} in bookingObject ${rowIndex}:`, bookingObject);
            return null;
          }

          return (
            <RangeMarkerSVG
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
          );
        });
      })}
    </div>
  );
};

export default BlockedRanges;
