
import './App.css'
import MonthTable from "./components/MonthTable"
import TableWithDateRange from "./components/tableWidthDayRange";

function App() {

  const unavailableRanges = [
    { start: "2024-02-10", end: "2024-02-10" },
    { start: "2024-02-15", end: "2024-02-18" }
  ];

  return (
    <>
      {/* <MonthTable year={2024} month={1} objectId={12345} unavailableRanges={unavailableRanges} /> */}

      <TableWithDateRange year={2024} bookingObjects={[12345, 23456, 34567]} />
    </>
  )
}


export default App
