
import './App.css'
import TableWithDateRange from "./components/tableWidthDayRange";
import { AppProps,BookingObject,DateRangeType } from "./types";

function App(props: AppProps) {


  const calendarSettings = [
    { 
      calendarRange: {
        startDate: '2024-01-01', // Required: Starting date of the calendar
        endDate: '2024-12-31',   // Optional: Ending date of the calendar. If omitted, could default to a set duration from startDate
        duration: {
          monthCount: 20,        // Optional: Number of months to display from startDate, ignored if endDate is set
          yearCount: 2           // Optional: Number of years to display from startDate, ignored if monthCount or endDate is set
        },
        clickMode: 'day',        // Required: 'day' for single day selection, 'range' for a range of dates
      },
      
      colorSettings: {
        available: '#00FF00',    // Green color for available dates
        notAvailable: '#FF0000', // Red color for not available dates
        onRequest: '#FFFF00',    // Yellow color for dates that are on request
        closed: '#000000',       // Black color for closed dates
      }
    }

  ]
  

  const exampleBookingObjects: BookingObject[] = [
    {
      id: '1111',
      title: 'Angebot 1',
      blockedDateRanges: [
        {
          start: '2024-02-05',
          end: '2024-02-10',
          type: 'booked',
          tooltip: 'Blocked for maintenance'
        },
        {
          start: '2024-03-15',
          end: '2024-03-20',
          type: 'booked',
          tooltip: 'Reserved for event'
        }
      ],
      dayStates: {
        arrivalDays: {
          exclusive: true,
          dates: ['2024-02-05', '2024-02-06', '2024-02-07'] // Example dates
        },
        departureDays: {
          exclusive: true,
          dates: ['2024-02-10', '2024-02-11', '2024-02-12'] // Example dates
        }
      }
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
