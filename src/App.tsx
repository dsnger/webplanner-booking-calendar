
import './App.css'
import TableWithDateRange from "./components/tableWidthDayRange";
import { AppProps,BookingObject,DateRangeType } from "./types";

function App(props: AppProps) {


  const exampleBookingObjects: BookingObject[] = [
    {
      id: '1111',
      title: 'Angebot 1',
      blockedDateRanges: [
        {
          start: '2024-02-05', // February 5, 2024
          end: '2024-02-10', // February 10, 2024
          type: 'booked' as DateRangeType,
          tooltip: 'Blocked for maintenance'
        },
        {
          start: '2024-03-15', // March 15, 2024
          end: '2024-03-20', // March 20, 2024
          type: 'booked' as DateRangeType,
          tooltip: 'Reserved for event'
        }
      ]
    },
    {
      id: '2222',
      title: 'Angebot 2',
      blockedDateRanges: [
        {
          start: '2024-05-01', // May 1, 2024
          type: 'closed' as DateRangeType,
          end: '2024-05-05', // May 5, 2024
        }
      ]
    },
    {
      id: '3333',
      title: 'Angebot 3',
      blockedDateRanges: [
        {
          start: '2024-03-01', // January 1, 2024
          end: '2024-03-02', // January 2, 2024
          type: 'on-request' as DateRangeType,
        }
      ]
    }
  ];

  const bookingObjects = props.bookingObjects || exampleBookingObjects;

  return (
    <>
      <TableWithDateRange year={2024} bookingObjects={bookingObjects} />
    </>
  )
}



export default App
