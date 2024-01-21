import React, { useState, useMemo, useEffect, useRef } from 'react';
import { isSameDay, endOfMonth, eachDayOfInterval, getMonth, format, startOfYear, endOfYear } from 'date-fns';
import { getMonthName, getDayName, formatDate } from "../utils";

type CellCoordinates = { rowIndex: number; colIndex: number } | null;

interface TableWithDateRangeProps {
  year: number; // Replace 'any' with the appropriate type for your rows
  bookingObjects: number[]; // Replace 'any' with the appropriate type for your days
}

const TableWithDateRange: React.FC<TableWithDateRangeProps> = ({ year, bookingObjects }): JSX.Element => {
  const [selectedCell, setSelectedCell] = useState<CellCoordinates>(null);
  const [secondSelectedCell, setSecondSelectedCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<CellCoordinates>(null);
  const [selectedDayStart, setSelectedDayStart] = useState<Date | null>(null);
  const [selectedDayEnd, setSelectedDayEnd] = useState<Date | null>(null);
  const [cellClasses, setCellClasses] = useState<{ rowIndex: number; colIndex: number; classes: string[] }[]>([]);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null); // Ref for the table body

  // Generate an array of days for the specified year
  const days = eachDayOfInterval({
    start: startOfYear(new Date(year, 0, 1)),
    end: endOfYear(new Date(year, 0, 1))
  });


  // Group dates by month
  const months = useMemo(() => {
    const monthMap = new Map();
    days.forEach(date => {
      const month = getMonth(date);
      const count = monthMap.get(month) || 0;
      monthMap.set(month, count + 1);
    });
    return Array.from(monthMap.entries());
  }, [year]);


  const isLastDayOfMonth = (date: Date): boolean => {
    const lastDayOfMonth = endOfMonth(date);
    return isSameDay(date, lastDayOfMonth);
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    
    if (selectedCell && secondSelectedCell) {
      // If a range is already selected, start a new selection
      setSelectedCell({ rowIndex, colIndex });
      setSecondSelectedCell(null);
      setCellClasses([]);
    
    } else if (selectedCell && (rowIndex === selectedCell.rowIndex) && (colIndex !== selectedCell.colIndex)) {
      // If only one cell is selected, set the second selected cell to complete the range
      setSecondSelectedCell({ rowIndex, colIndex });
      // Determine the range of cells to set as selected
      const startColIndex = Math.min(selectedCell.colIndex, colIndex); 
      const endColIndex = Math.max(selectedCell.colIndex, colIndex);  
      setHighlightedRange(rowIndex, startColIndex, endColIndex);
      
    } else {
      // If no cell is selected or the same cell is clicked again, set it as the first selected cell
      setSelectedCell({ rowIndex, colIndex });
    }
    // Reset the hovered cell when starting a new selection
    setHoveredCell(null);
  
  };


  const setHighlightedRange = (rowIndex: number, startColIndex: number, endColIndex: number): void => {
    for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
      // Apply the "is-selected" class to the cell at rowIndex and colIndex
      applyClassToCell( rowIndex, colIndex, 'is-selected' );
    }
  };


  // Function to apply class to a cell
  const applyClassToCell = (rowIndex: number, colIndex: number, className: string) => {
    // Find the existing cell entry or create a new one
    const cellEntryIndex = cellClasses.findIndex(entry => entry.rowIndex === rowIndex && entry.colIndex === colIndex);

    if (cellEntryIndex !== -1) {
      // Cell entry exists, update the classes
      const updatedCellClasses = [...cellClasses];
      updatedCellClasses[cellEntryIndex].classes = [className];
      setCellClasses(updatedCellClasses);
    } else {
      // Cell entry doesn't exist, create a new entry
      setCellClasses(prevCellClasses => [
        ...prevCellClasses,
        { rowIndex, colIndex, classes: [className] }
      ]);
    }
  };

  

  const handleCellHover = (rowIndex: number, colIndex: number) => {
    if (selectedCell && !secondSelectedCell) {
      setHoveredCell({ rowIndex, colIndex });
    }
  };

  const isCellInRange = (rowIndex: number, colIndex: number) => {
    if (!selectedCell) return false;
    if (rowIndex !== selectedCell.rowIndex) return false;
    
    const endCell = secondSelectedCell || hoveredCell;
    if (!endCell) return false;

    const startColIndex = Math.min(selectedCell.colIndex, endCell.colIndex);
    const endColIndex = Math.max(selectedCell.colIndex, endCell.colIndex);
    return colIndex >= startColIndex && colIndex <= endColIndex;
  };
  


  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Check if the click is outside of the table body
      if (tableBodyRef.current && !tableBodyRef.current.contains(event.target as Node)) {
        setSelectedCell(null);
        setSecondSelectedCell(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);


  return (
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-900 pb-3">
      <table className="min-w-full">
        <thead>
          <tr>
            {months.map(([month, count]) => (
              <th
                key={month}
                colSpan={count}
                className={`
                  p-1 border border-r-2 border-l-2 border-gray-500
                `}
              >
                {getMonthName(year, month)}
              </th>
            ))}
          </tr>
          <tr>
            {days.map((date, dayIndex) => (
              <th
                key={date.toISOString()}
                className={`
                  border-l border-r border-b border-gray-500
                  ${dayIndex === 0 ? 'border-l-2' : ''}
                  ${isLastDayOfMonth(date) ? 'border-r-2' : ''}
                `}
              >
                <div className="text-center">
                  <span className="text-xs font-light block">{getDayName(date)}</span>
                  <span className="text-xs block">{format(date, 'd')}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody ref={tableBodyRef}>
          {bookingObjects.map((objectId, rowIndex) => (
            <tr key={rowIndex}>
              {days.map((date, colIndex) => {
                const cellClassNames = [
                  'cell',
                  colIndex === 0 ? 'border-l-2' : '',
                  isCellInRange(rowIndex, colIndex) ? 'highlight' : '',
                  selectedCell?.rowIndex === rowIndex && selectedCell?.colIndex === colIndex ? 'is-selected' : '',
                  isLastDayOfMonth(date) ? 'border-r-2' : '',
                  cellClasses.find(entry => entry.rowIndex === rowIndex && entry.colIndex === colIndex)?.classes?.join(' ') || ''
                ];
  
                return (
                  <td
                    key={colIndex}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                    className={cellClassNames.join(' ')}
                  >
                    <div className="px-3 h-6 cursor-pointer" data-object-id={objectId} data-date-string={formatDate(date)}>
                      {/* This is the clickable/selectable cell */}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
};

export default TableWithDateRange;
