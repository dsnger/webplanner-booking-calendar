import React, { useEffect, useRef, useState } from 'react';

interface MonthTableProps {
  year: number;
  month: number; // 0-indexed (0 for January, 1 for February, etc.)
};

const MonthTable: React.FC<MonthTableProps> = ({ year, month }) => {
  // Helper function to get the number of days in a month
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const totalDays = getDaysInMonth(year, month);
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  const getDayName = (dayNumber: number): string => {
    const date = new Date(year, month, dayNumber);
    return date.toLocaleDateString('de-DE', { weekday: 'short' });
  };

  const getMonthName = (month: number): string => {
    const date = new Date(year, month, 1);
    return date.toLocaleDateString('de-DE', { month: 'long' });
  };

  // States to track the start and end of the selected range
  const [selectedDayStart, setSelectedDayStart] = useState<number | null>(null);
  const [selectedDayEnd, setSelectedDayEnd] = useState<number | null>(null);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null); // Ref for the table body

  // Function to check if a day is in the selected range
  const isDayInRange = (day: number) => {
    if (selectedDayStart !== null && selectedDayEnd !== null) {
      return day >= selectedDayStart && day <= selectedDayEnd;
    }
    return day === selectedDayStart;
  };

  // Handle day cell click
  const handleDayClick = (day: number) => {
    if (selectedDayStart === null || (selectedDayStart !== null && selectedDayEnd !== null)) {
      // Start a new selection
      setSelectedDayStart(day);
      setSelectedDayEnd(null);
    } else if (selectedDayStart !== null && selectedDayEnd === null) {
      // Set the end of the selection range
      if (day >= selectedDayStart) {
        setSelectedDayEnd(day);
      } else {
        setSelectedDayEnd(selectedDayStart);
        setSelectedDayStart(day);
      }
    }
  };




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


  return (
    <table className="min-w-full">
      <thead>
        <tr>
          <th colSpan={totalDays} className="px-4 py-1 text-center text-sm font-bold border border-gray-500">
            {getMonthName(month)}
          </th>
        </tr>
        <tr>
          {days.map((day) => (
            <th key={day} className="px-1 border-l border-r border-b border-gray-500">
              <div className="text-center">
                <span className="text-xs font-light block">{getDayName(day)}</span>
                <span className="text-sm block">{day}</span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody ref={tableBodyRef}>
        <tr>
          {days.map((day) => (
            <td
              key={day}
              className={`px-4 h-6 border-l border-r border-b border-gray-500 cursor-pointer ${isDayInRange(day) ? 'bg-blue-200' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              {/* This is the clickable/selectable cell */}
            </td>
          ))}
        </tr>
      </tbody>
    </table >
  );
}

  export default MonthTable;
