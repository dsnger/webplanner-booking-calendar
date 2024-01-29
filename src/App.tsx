
import './App.css'
import BookingCalendar from "./components/BookingCalendar";
import { BookingCalendarSettings } from "./types";

function App() {

  const exampleCalendarSettings: BookingCalendarSettings = {
    calendarRange: {
      startDate: '2024-01-01',
      endDate: '',
      duration: {
        monthCount: 20,
        yearCount: 2
      },
      clickMode: 'day',
    },

    colorSettings: {
      booked: '#00ff',
      available: '#00FF00',
      notAvailable: '#FF0000',
      onRequest: '#FFFF00',
      closed: '#aaa',
    },

    bookingObjects: [
      {
        objId: '1111',
        title: 'Angebot 1',
        blockedDateRanges: [
          {
            start: '2024-02-05',
            end: '2024-02-10',
            type: 'unavailable',
            tooltip: 'Blocked for maintenance'
          },
          {
            start: '2024-03-15',
            end: '2024-03-20',
            type: 'booked',
            tooltip: 'Reserved for event'
          },
          {
            start: '2024-06-11',
            end: '2024-06-22',
            type: 'booked',
            tooltip: 'Reserved for event'
          }
        ],
        dayStates: {
          arrivalDays: {
            exclusive: true,
            dates: ['2024-02-05', '2024-02-06', '2024-02-07']
          },
          departureDays: {
            exclusive: true,
            dates: ['2024-02-10', '2024-02-11', '2024-02-12']
          }
        }
      },
      {
        objId: '2222',
        title: 'Angebot 2',
        blockedDateRanges: [
          {
            start: '2024-03-05',
            end: '2024-03-10',
            type: 'unavailable',
            tooltip: 'Blocked for maintenance'
          },
          {
            start: '2024-07-15',
            end: '2024-07-20',
            type: 'booked',
            tooltip: 'Reserved for event'
          },
          {
            start: '2024-11-11',
            end: '2024-11-22',
            type: 'booked',
            tooltip: 'Reserved for event'
          }
        ],
        dayStates: {
          arrivalDays: {
            exclusive: true,
            dates: ['2024-02-05', '2024-02-06', '2024-02-07']
          },
          departureDays: {
            exclusive: true,
            dates: ['2024-02-10', '2024-02-11', '2024-02-12']
          }
        }
      }
    ]
  }

  return (
    <>
      <BookingCalendar calSettings={exampleCalendarSettings} />
    </>
  )
}


export default App
