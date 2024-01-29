export interface DayColumnProps { 
  date: Date
  onClick: (date: Date) => void
}

export type CellState = ('is-available' | 'is-unavailable' | 'is-start' | 'is-end' | 'is-selected')[];

export type DateRangeType = 'booked' | 'closed' | 'on-request';

export interface BlockedDateRangeInfo {
  start: string;
  end: string;
  type: DateRangeType;
  tooltip?: string;
}

// export interface AppProps {
//   settings?: {
//     showBlockedDates: boolean;
//     showBlockedDatesTooltips: boolean;
//   },
//   bookingObjects?: BookingObject[];
// }

export interface BlockedDateRangeInfo {
  start: string;
  end: string;
  type: DateRangeType;
  tooltip?: string;
}


export interface BookingCalendarSettings {
  calendarRange: CalendarRange;
  colorSettings: ColorSettings;
  bookingObjects: BookingObject[];
}

export interface CalendarRange {
  startDate: string;
  endDate?: string;
  duration?: Duration;
  clickMode: 'day' | 'range';
}

export interface Duration {
  monthCount?: number;
  yearCount?: number;
}

export interface ColorSettings {
  booked: string;
  available: string;
  notAvailable: string;
  onRequest: string;
  closed: string;
}

export interface BookingObject {
  objId: string;
  title: string;
  blockedDateRanges: DateRange[];
  dayTypes: dayTypes;
}

export interface DateRange {
  start: string;
  end: string;
  type: string;
  tooltip: string;
}

export interface dayTypes {
  arrivalDays: DaySetting;
  departureDays: DaySetting;
}

export interface DaySetting {
  exclusive: boolean; // Include other modes if they exist
  dates: string[];
}



