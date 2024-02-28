import { BookingObject } from "../types"

interface BookingObjectsTableProps {
  bookingObjects: BookingObject[];
}

const BookingObjectsTable: React.FC<BookingObjectsTableProps> = ({ bookingObjects }) => {
  return (
    <div className="titles-table flex items-end pb-4 mb-[2px] mr-[-1px] min-w-[80px] max-w-[240px] w-[15vw]">
      <table className="w-full table-fixed">
        <tbody>
          {bookingObjects.map((bookingObject) => (
            <tr key={bookingObject.objId}>
              <td className="object-titles h-9 min-w-9 text-left p-1 m-0 border border-r border-l-0 border-gray-500 truncate">
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