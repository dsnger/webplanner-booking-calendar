# WebPlanner Booking Calendar

The WebPlanner Booking Calendar is a highly customizable and dynamic booking calendar component built using React, TypeScript, and TailwindCSS. This component is designed to seamlessly integrate into web applications, offering an interactive booking experience. It provides functionalities such as date selection, tooltips, displaying availability, handling bookings, and visualizing custom date ranges and settings. Additionally, it features dynamic range markers and interacts with a backend API for real-time updates and data synchronization.

## Table of Contents

- [WebPlanner Booking Calendar](#webplanner-booking-calendar)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Demo](#demo)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Configuration](#configuration)
  - [Components](#components)
    - [DynamicRange](#dynamicrange)
    - [DayContent](#daycontent)
    - [ArrivalAndDepartureDays](#arrivalanddeparturedays)
  - [Hooks](#hooks)
    - [useDays](#usedays)
    - [useSelectedDates](#useselecteddates)
  - [Utils](#utils)
  - [Development](#development)

## Features

- Date selection with dynamic range marking
- Handling of blocked dates to prevent invalid selections
- Tooltips for arrival and departure days
- Customizable through context and settings
- Responsive design using TailwindCSS

## Demo

Check out a live demo of the component [here](http://webplanner.smilefx.de/bookingcalendar/v2)

## Installation

To install the necessary dependencies, run:

```bash
npm install
```

or

```bash
yarn install`
```

## Usage

To use the WebPlanner Booking Calendar component in your project, follow these steps:

1. **Import the necessary components and providers:**

```bash
import React from 'react';
import { DaysProvider } from '@/context/DaysContext';
import { SelectedDatesProvider } from '@/context/SelectedDatesContext';
import ArrivalAndDepartureDays from '@/components/ArrivalAndDepartureDays';
import DynamicRange from '@/components/DynamicRange';
```

1. **Wrap your component with the providers:**

```bash
const App: React.FC = () => (
  <SelectedDatesProvider>
    <DaysProvider>
      <ArrivalAndDepartureDays />
      <DynamicRange />
    </DaysProvider>
  </SelectedDatesProvider>
);

export default App;

```

## Configuration

Configuration is handled through the `useSettings` hook and context providers. Ensure your settings are correctly defined and passed to the components.

```bash
const { calendarSettings } = useSettings();

const settings = {
  cellSettings: {
    cellWidth: '32px',
    cellHeight: '32px',
    cellGap: '4px',
  },
  colorSettings: {
    available: '#00FF00',
    notAvailable: '#FF0000',
  },
  calendarRange: {
    startDate: '2023-01-01',
    endDate: '2023-12-31',
  },
  bookingObjects: [
    {
      id: 1,
      dayTypes: {
        arrivalDays: { dates: ['2023-05-01', '2023-05-15'] },
        departureDays: { dates: ['2023-05-10', '2023-05-20'] },
      },
      blockedDateRanges: [
        {
          start: '2023-06-01',
          end: '2023-06-10',
          starthalf: false,
          endhalf: false,
          type: 'blocked',
          tooltip: 'Maintenance',
        },
      ],
    },
  ],
};

```

## Components

### DynamicRange

Handles the dynamic range selection and rendering of range markers.

### DayContent

Renders individual days, handling clicks, hover states, and tooltips.

### ArrivalAndDepartureDays

Renders the arrival and departure days, integrating with the booking objects and day statuses.

## Hooks

### useDays

Provides the days and their statuses, calculated from the booking objects and settings.

### useSelectedDates

Manages the selected dates, including starting and finalizing selections and handling hover states.

## Utils

Utility functions for date manipulation and status calculations are located in `dateUtils.ts`. Key functions include:

- `generateCalendarDays`
- `preCalculateDaysStatusFlags`
- `isBlockedDateRange`
- `isDateType`
- `hasExclusiveDateTypes`

## Development

To start the development server, run:

```bash
npm run dev
```

or

```bash
yarn dev
```

To build the project for production, run:

```bash
npm run build
```

or

```bash
yarn build
```
