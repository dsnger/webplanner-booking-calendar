import React from "react";
import { BookingObject } from "../types"

interface BookingObjectsTableProps {
  bookingObjects: BookingObject[];
}

const BookingObjectsTable: React.FC<BookingObjectsTableProps> = ({ bookingObjects }) => {
  return (
    <div className="objects-table flex flex-col justify-end items-end ml-[-1px] m-[1px] min-w-[80px] max-w-[220px] w-[15vw] absolute bottom-0 h-full z-20">
      <div className="w-full grid gap-cell-gap">
        {bookingObjects.map((bookingObject) => (
          <div key={bookingObject.objId}>
            {bookingObject.extLink ? (
              <a href={bookingObject.extLink} target="_blank" rel="noopener noreferrer" className="object-titles flex items-center bg-white bg-opacity-90 h-cell-height min-w-9 text-left text-sm m-0 pl-3 hover:bg-slate-300  truncate">
                {bookingObject.title}
              </a>
            ) : (
              <div className="object-titles flex items-center h-cell-height min-w-10 text-left text-sm p-1 m-0 pl-3 bg-white bg-opacity-90 truncate">
                {bookingObject.title}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingObjectsTable