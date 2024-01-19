
import './App.css'
import MonthTable from "./components/MonthTable"

function App() {

  const stringUnavailableRanges = [
    { start: "2024-02-10", end: "2024-02-10" }, // Single-day range
    { start: "2024-02-15", end: "2024-02-18" }  // Four-day range
  ];

  return (
    <>
      <MonthTable year={2024} month={1} objectId={12345} unavailableRanges={stringUnavailableRanges}/>
    </>
  )
}

export default App
