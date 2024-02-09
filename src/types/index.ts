export interface DayColumnProps { 
  date: Date
  onClick: (date: Date) => void
}

export type CellState = ('is-available' | 'is-unavailable' | 'is-start' | 'is-end' | 'is-selected')[];

export type DateRangeType = 'booked' | 'closed' | 'on-request';

export interface BlockedDateRangeInfo {
  start: string;
  end: string;
  starthalf: boolean;
  endhalf: boolean;
  type: DateRangeType;
  tooltip?: string;
}

export interface BookingCalendarSettings {
  calendarRange: CalendarRange;
  colorSettings: ColorSettings;
  bookingObjects: BookingObject[];
}

export type CalendarRange = {
  startDate: string;
  minDate?: string | '';
  endDate?: string | '';
  clickMode: 'day' | 'range';
  daprtureMode: string | '';
}

export type Duration = {
  monthCount?: number | null;
  yearCount?: number | null;
}

export type ColorSettings = {
  booked: string;
  available: string;
  notAvailable: string;
  onRequest: string;
  closed: string;
}


export interface BookingObject {
  objId: string;
  title: string;
  extLink: string;
  bookingLink: string;
  blockedDateRanges: DateRange[];
  dayTypes: dayTypes;
}

export interface DateRange {
  start: string;
  end: string;
  starthalf: boolean;
  endhalf: boolean;
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



