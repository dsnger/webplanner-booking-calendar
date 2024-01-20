export interface DayColumnProps { 
  date: Date
  onClick: (date: Date) => void
}


export interface CellState {
  state: 'avail' | 'unavail' | 'unavail-start' | 'unavail-end' | 'select-start' | 'select-end' | 'select';
}

