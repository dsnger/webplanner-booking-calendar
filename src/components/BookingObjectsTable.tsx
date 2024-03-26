import React from "react";
import { BookingObject } from "../types"

interface BookingObjectsTableProps {
  bookingObjects: BookingObject[];
}

const BookingObjectsTable: React.FC<BookingObjectsTableProps> = ({ bookingObjects }) => {
  return (
    <div className="titles-table flex flex-col items-end pb-4 mb-[2px] mr-[-1px] min-w-[80px] max-w-[240px] w-[15vw]">
      <div className="w-full mr-1 grid gap-y-0 border-0">
        <div className="h-10"></div>
        <div className="h-9"></div>
        {bookingObjects.map((bookingObject) => (
          <div key={bookingObject.objId}>
            {bookingObject.extLink ? (
              <a href={bookingObject.extLink} target="_blank" rel="noopener noreferrer" className="object-titles flex items-center h-10 min-w-9 text-left text-sm p-1 m-0 pl-3 border-r-2 border-l-0 border-b-4 border-white bg-slate-100 hover:bg-slate-300  truncate">
                {bookingObject.title}
              </a>
            ) : (
              <div className="object-titles flex items-center h-10 min-w-10 text-left text-sm p-1 m-0 pl-3 border-r-2 border-l-0 border-b-4 border-white bg-slate-100 truncate">
                {bookingObject.title}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingObjectsTable;