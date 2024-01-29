export interface DayColumnProps { 
  date: Date
  onClick: (date: Date) => void
}

export type CellState = ('is-available' | 'is-unavailable' | 'is-start' | 'is-end' | 'is-selected')[];

export interface DateRange {
  start: Date;
  end: Date;
}

export type DateRangeType = 'booked' | 'closed' | 'on-request';


export interface BlockedDateRangeInfo {
  start: string;
  end: string;
  type: DateRangeType;
  tooltip?: string;
}

export interface BookingObject {
  id: string;
  title: string;
  blockedDateRanges: BlockedDateRangeInfo[];
}

export interface AppProps {
  settings?: {
    showBlockedDates: boolean;
    showBlockedDatesTooltips: boolean;
  },
  bookingObjects?: BookingObject[];
}

export interface BlockedDateRangeInfo {
  start: string;
  end: string;
  type: DateRangeType;
  tooltip?: string;
}


export interface BookingObject {
  id: string;
  title: string;
  blockedDateRanges: BlockedDateRangeInfo[];
}

