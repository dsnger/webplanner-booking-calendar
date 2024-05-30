import React, { RefObject, useRef } from 'react';
import { BookingObject, DayStatus } from '../types';
import BlockedRanges from "./BlockedRanges";
import ArrivalAndDepartureDays from "./ArrivalAndDepartureDays";

// Props type definition
interface TableBodyProps {
  bookingObjects: BookingObject[];
  days: Date[];
  daysWithStatus: DayStatus[][];
  currentDate: Date;
  bookingCalendarWrapperRef: RefObject<HTMLDivElement>;
}

const BookingCalenderTableBody: React.FC<TableBodyProps> = ({
  bookingObjects,
  days,
}) => {

  const tableBodyRef = useRef<HTMLDivElement>(null);


  return (
    <div ref={tableBodyRef} className="relative">
      <div>
        <ArrivalAndDepartureDays/>
      </div>
      <BlockedRanges bookingObjects={bookingObjects} days={days}/>
    </div>
  );
};

export default BookingCalenderTableBody;
