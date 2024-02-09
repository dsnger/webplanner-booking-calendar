import { BookingObject } from "../types"

interface BookingObjectsTableProps {
  bookingObjects: BookingObject[];
}

const BookingObjectsTable: React.FC<BookingObjectsTableProps> = ({ bookingObjects }) => {
  return (
    <div className="titles-table flex items-end w-full max-w-5xl pb-4 mb-[-4px] mr-[-1px]">
      <table className="w-full min-w-[220px] max-w-5xl">
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