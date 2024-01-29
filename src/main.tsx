import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BookingObject} from "./types";

const exampleBookingObjects: BookingObject[] = [
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
        type: 'closed',
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
        type: 'on-request',
      }
    ]
  }
];

ReactDOM.createRoot(document.getElementById('booking-calendar')!).render(
  <React.StrictMode>
    <App settings={undefined} bookingObjects={exampleBookingObjects} />
  </React.StrictMode>
);

