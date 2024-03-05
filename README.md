# WebPlanner Booking Calendar

The WebPlanner Booking Calendar is a React-based component designed to offer a dynamic and interactive booking calendar experience. It integrates seamlessly into web applications, providing functionalities for displaying availability, handling bookings, and visualizing custom date ranges and settings.

## Demo
http://webplanner.smilefx.de/bookingcalendar/

## Features

- Dynamic calendar generation based on provided settings.
- Customizable color schemes for different booking states.
- Support for multiple languages.
- Interactive date selection for booking ranges.
- Utilizes `date-fns` for comprehensive date operations.

## Todo:
- [x] ~~Calendar start option (today|date)~~
- [x] ~~Calendar end option (today|date)~~
- [x] ~~Calendar Date Range (years | year | months)~~
- [x] ~~Color Settings~~
- [x] ~~Legend Settings (Unavailable States)~~
- [x] Submitting Selection
- [ ] Localization
- [x] ~~das Ende des scrollens muss begrenzt sein auf Jahr/Monat-Basis.~~
- [x] ~~Standard ist das aktuelles Jahr + 2 volle Jahre. Manche Kunden aber 3 Jahre und andere nur 1~~
- [x] Tage können 'disabled' sein. Unabhängig von Ihrer Farbe sind diese dann blasser und nicht klickbar.
- [x] Tage können als Anreisetag gekennzeichnet sein (eigene Klasse, die dann einfach nen Rahmen um den Tag setzt). Dies ist nur eine optische Kennzeichnung, die Funktion kommt über disabled.
- [ ] Neu, da ja jetzt das Nacheinander-Klicken von Anfangsdatum und Enddatum kommt: Tage können Anreisetag aber ggf kein Abreisetag sein. Da brauchts 2 Disabled-Zustände.
Und der Modus Nacheinander-Klicken oder Einmal-klick und direkt Formular öffnen muss im Script setzbar sein. Manche Kunden bieten Party-Locations oä an, die man nur einen Tag bucht.
- [x] Kalender-Auswahl übergeben
- [x] Mobile Support / Responsiv
- [ ] Verlinkung der Objekte
- [ ] Monate blättern
- [ ] Halber geblockter Tag, trotzdem Anreisetag





## Installation

```
npm install
npm run build
```

## Usage
To use the booking calendar, import the component into your React project and provide the necessary props.


```
import BookingCalendar from 'path-to-BookingCalendar';

const App = () => {
  return (
    <BookingCalendar fewoOwnID={123} lang="en" />
  );
};

export default App;
```

## Props
- fewoOwnID: (number) Unique identifier for the booking entity.
- lang: (string) Language code for localization.

## Customization
You can customize the calendar's appearance and behavior by modifying the color settings and adapting the calendar settings fetching logic as per your backend structure.

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to enhance the functionality or documentation of the WebPlanner Booking Calendar.

## License
This project is licensed under the MIT License - see the LICENSE file for details.


