import React, { useEffect, useRef, useState } from 'react';
import { isSameDay, isWithinInterval, eachDayOfInterval, startOfMonth, endOfMonth, format } from 'date-fns';
import { de } from 'date-fns/locale';
import DayCell from "./DayCell";
import { CellState } from "../types";

interface DateRangeString {
  start: string;
  end: string;
  tooltip?: string;
}

interface DateRange {
  start: Date;
  end: Date;
  tooltip?: string;
}


interface MonthTableProps {
  year: number;
  month: number; // Note: month is zero-indexed (0 for January, 1 for February, etc.)
  objectId: number;
  unavailableRanges?: DateRangeString[];
};

const MonthTable: React.FC<MonthTableProps> = ({ year, month, objectId, unavailableRanges = [] }): JSX.Element => {

  // States to track the start and end of the selected range
  const [selectedDayStart, setSelectedDayStart] = useState<Date | null>(null);
  const [selectedDayEnd, setSelectedDayEnd] = useState<Date | null>(null);
  // const [cellState, setCellState] = useState<CellState | null>(['is-available']); // 'avail' is the default state
  const tableBodyRef = useRef<HTMLTableSectionElement>(null); // Ref for the table body
            


  const days = eachDayOfInterval({
    start: startOfMonth(new Date(year, month)),
    end: endOfMonth(new Date(year, month))
  });

  const getDayName = (date: Date): string => {
    return format(date, 'eee', { locale: de }); // 'eee' for short day name
  };

  const getMonthName = (year: number, month: number): string => {
    return format(new Date(year, month), 'MMMM', { locale: de }); // 'MMMM' for full month name
  };

  const formatDate = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  const isDayInRange = (date: Date): boolean => {
    if (selectedDayStart && selectedDayEnd) {
      return date >= selectedDayStart && date <= selectedDayEnd;
    }
    return selectedDayStart ? date.getTime() === selectedDayStart.getTime() : false;
  };

  const unavailableRangeDates = unavailableRanges.map(range => ({
    start: new Date(range.start),
    end: new Date(range.end),
    tooltip: range.tooltip // Include the tooltip property
  }));


  const getUnavailableDayInfo = (date: Date): { isUnavailable: boolean; tooltip: string | null, isUnavailStart: boolean, isUnavailEnd: boolean } => {
    let isUnavailStart = false;
    let isUnavailEnd = false;

    const range = unavailableRangeDates.find(range => {
      if (isSameDay(date, range.start)) {
        isUnavailStart = true;
        return true;
      }
      if (isSameDay(date, range.end)) {
        isUnavailEnd = true;
        return true;
      }

      if (isWithinInterval(date, { start: range.start, end: range.end })) {
        return true;
      };
    });

    return {
      isUnavailable: !!range,
      tooltip: range?.tooltip || null,
      isUnavailStart,
      isUnavailEnd
    };
  };


  const getSelectedDayInfo = (date: Date, selectedDayStart?: Date | null, selectedDayEnd?: Date | null): { isSelectedStart: boolean, isSelectedEnd: boolean, isSelected: boolean } => {

    let isSelectedStart = selectedDayStart && isSameDay(date, selectedDayStart);
    let isSelectedEnd = selectedDayEnd && isSameDay(date, selectedDayEnd);
    let isSelected = false;
    if (selectedDayStart && selectedDayEnd) {
      isSelected = isWithinInterval(date, { start: selectedDayStart, end: selectedDayEnd });
    }

    return {
      isSelectedStart: isSelectedStart ?? false,
      isSelectedEnd: isSelectedEnd ?? false,
      isSelected
    };
  };


  const areUnavailableDaysBetween = (start: Date, end: Date, unavailableRangeDates: DateRange[]) => {

    return unavailableRangeDates.some(range => {

      // Check if any day in the range of start to end is within an unavailable date range
      return isWithinInterval(start, { start: range.start, end: range.end }) ||
        isWithinInterval(end, { start: range.start, end: range.end }) ||
        (start < range.start && end > range.end) || (start > range.start && end < range.end);
    });
  };


  const handleDayClick  = (clickedDate: Date): void => {
   
    if (selectedDayStart === null || (selectedDayStart !== null && selectedDayEnd !== null)) {
      // Start a new selection
      setSelectedDayStart(clickedDate);
      setSelectedDayEnd(null);

    } else if (selectedDayStart !== null && selectedDayEnd === null) {
      // Check if there are unavailable days between selectedDayStart and clickedDate
      const unavailableDaysBetween = areUnavailableDaysBetween(selectedDayStart, clickedDate, unavailableRangeDates);

      if (unavailableDaysBetween) {
        // Deselect the first day and set clickedDate as the new start
        setSelectedDayStart(clickedDate);
        setSelectedDayEnd(null);
       
      } else {
        // Set the end of the selection range
        setSelectedDayEnd(clickedDate);
        // Swap dates if selected in reverse order
        if (clickedDate < selectedDayStart) {
          setSelectedDayEnd(selectedDayStart);
          setSelectedDayStart(clickedDate);
        }
        //alertSelection(selectedDayStart, clickedDate);
      }
    }
  };


  // Function to alert the selected date or date range
  // const alertSelection = (startDate: Date, endDate: Date) => {
  //   // Check if startDate is after endDate, if so, swap them
  //   let start = startDate;
  //   let end = endDate;
  //   if (start > end) {
  //     [start, end] = [end, start];
  //   }

  //   // Format dates after ensuring correct order
  //   const startDateString = formatDate(start);
  //   const endDateString = formatDate(end);

  //   setTimeout(() => {
  //     if (start.toDateString() === end.toDateString()) {
  //       alert(`Selected date: ${startDateString}`);
  //     } else {
  //       alert(`Selected date range: ${startDateString} to ${endDateString}`);
  //     }
  //   }, 300);
  // };


  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Check if the click is outside of the table body
      if (tableBodyRef.current && !tableBodyRef.current.contains(event.target as Node)) {
        setSelectedDayStart(null);
        setSelectedDayEnd(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);


  const getDayCellData = (date: Date): { dayCellState:CellState, isUnavailable: boolean, hasSelection: boolean, tooltip: string | null } => {
   
    let hasSelection = false;
    let dayCellState: CellState = ['is-available'];

    const { isUnavailable, isUnavailStart, isUnavailEnd, tooltip } = getUnavailableDayInfo(date);
    
    if (isUnavailable) {
      hasSelection = true;
      dayCellState = isUnavailStart ? ['is-unavailable','is-start'] : isUnavailEnd ? ['is-unavailable','is-end'] : ['is-unavailable'];
    }

    if (!isUnavailable && selectedDayStart) {

      const { isSelected, isSelectedStart, isSelectedEnd } = getSelectedDayInfo(date, selectedDayStart, selectedDayEnd);

      if (isSelected) {
        hasSelection = true;
        dayCellState = isSelectedStart ? ['is-selected', 'is-start'] : isSelectedEnd ? ['is-selected', 'is-end'] : ['is-selected'];
      }
    } 

    return { dayCellState, isUnavailable, hasSelection, tooltip };
  };



  return (
    <table className="min-w-full">
      <thead>
        <tr>
          <th colSpan={days.length} className="px-4 py-1 text-center text-sm font-bold border border-gray-500">
            {getMonthName(year, month)}
          </th>
        </tr>
        <tr>
          {days.map((date, index) => (
            <th key={index} className="px-1 border-l border-r border-b border-gray-500">
              <div className="text-center">
                <span className="text-xs font-light block">{getDayName(date)}</span>
                <span className="text-sm block">{format(date, 'd')}</span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody ref={tableBodyRef}>
        <tr>
          {days.map((date, index) => {

            const { dayCellState, isUnavailable, hasSelection, tooltip } = getDayCellData(date);

            return (
              <DayCell
                key={`day_${index}_${objectId}`}
                date={date}
                objectId={objectId}
                isDayInRange={isDayInRange}
                onDayClick={handleDayClick}
                formatDate={formatDate}
                isUnavailable={isUnavailable}
                isSelected={hasSelection}
                cellState={dayCellState}
                tooltip={tooltip}
              />
            );
          })}
        </tr>
      </tbody>
    </table>
  );





}

export default MonthTable;
