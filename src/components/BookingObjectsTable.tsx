import React from "react";
import { BookingObject } from "../types"

interface BookingObjectsTableProps {
  bookingObjects: BookingObject[];
}

const BookingObjectsTable: React.FC<BookingObjectsTableProps> = ({ bookingObjects }) => {
  return (
    <div className="titles-table flex items-end pb-4 mb-[2px] mr-[-1px] min-w-[80px] max-w-[240px] w-[15vw]">
      <table className="w-full table-fixed border-0 mr-1">
        <tbody className="border-0">
          {bookingObjects.map((bookingObject) => (
            <tr key={bookingObject.objId} className="border-b-4 border-white">
              <td className="object-titles h-9 min-w-9 text-left text-sm p-1 m-0 border-r-2 border-l-0 pl-2 border-white bg-slate-100 truncate">
                {bookingObject.title} {/* Assuming each bookingObject has a title */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingObjectsTable;