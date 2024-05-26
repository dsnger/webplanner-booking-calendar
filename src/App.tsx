
import './App.css'
import BookingCalendar from "./components/BookingCalendar";
import { SettingsProvider } from "./context/SettingsContext";

function App() {

  return (
    <>
      <SettingsProvider  fewoOwnID={10745} lang={'de'}>
        <BookingCalendar />
      </SettingsProvider>
    </>
  )
}


export default App
