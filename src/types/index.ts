export interface DayColumnProps { 
  date: Date
  onClick: (date: Date) => void
}

export type CellState = ('is-available' | 'is-unavailable' | 'is-start' | 'is-end' | 'is-selected')[];

export type DateRangeType = ('booked' | 'unavailable' | 'on-request' | 'closed');

export interface DateRange {
  start: Date;
  end: Date;
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

