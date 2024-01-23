
import './App.css'
import TableWithDateRange from "./components/tableWidthDayRange";
import { BookingObject } from "./types";

function App() {

  const exampleBookingObjects = [
    {
      id: '1111',
      title: 'Angebot 1',
      blockedDateRanges: [
        {
          start: '2024-02-05', // February 5, 2024
          end: '2024-02-10', // February 10, 2024
          type: 'booked',
          tooltip: 'Blocked for maintenance'
        },
        {
          start: '2024-03-15', // March 15, 2024
          end: '2024-03-20', // March 20, 2024
          type: 'booked',
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
          type: 'close',
          end: '2024-05-05', // May 5, 2024
        }
      ]
    },
    {
      id: '3333',
      title: 'Angebot 3',
      blockedDateRanges: [
        {
          start: '2024-01-01', // January 1, 2024
          end: '2024-01-02', // January 2, 2024
          type: 'on-request',
        }
      ]
    }
  ];
  
  

  return (
    <>
      {/* <MonthTable year={2024} month={1} objectId={12345} unavailableRanges={unavailableRanges} /> */}

      <TableWithDateRange year={2024} bookingObjects={exampleBookingObjects} />
    </>
  )
}


export default App
