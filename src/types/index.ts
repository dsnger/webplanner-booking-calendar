export interface DayColumnProps { 
  date: Date
  onClick: (date: Date) => void
}


export type CellState = ('is-available' | 'is-unavailable' | 'is-start' | 'is-end' | 'is-selected')[];

