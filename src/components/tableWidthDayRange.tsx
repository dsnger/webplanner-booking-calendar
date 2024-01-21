import React, { useState, useMemo } from 'react';
import { isSameDay, endOfMonth, eachDayOfInterval, getMonth, format, startOfYear, endOfYear } from 'date-fns';
import { getMonthName, getDayName, formatDate } from "../utils";

type CellCoordinates = { rowIndex: number; colIndex: number } | null;
type HoverDirection = 'right' | 'left' | null;


interface TableWithDateRangeProps {
  year: number; // Replace 'any' with the appropriate type for your rows
  bookingObjects: number[]; // Replace 'any' with the appropriate type for your days
}

const TableWithDateRange: React.FC<TableWithDateRangeProps> = ({ year, bookingObjects }): JSX.Element => {
  const [selectedCell, setSelectedCell] = useState<CellCoordinates>(null);
  const [hoveredCell, setHoveredCell] = useState<CellCoordinates>(null);
  const [hoverDirection, setHoverDirection] = useState<HoverDirection>(null);

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
    setSelectedCell({ rowIndex, colIndex });
    setHoveredCell(null);
  };

  const handleCellHover = (rowIndex: number, colIndex: number) => {
    if (selectedCell) {
      setHoveredCell({ rowIndex, colIndex });
      const direction = colIndex >= selectedCell.colIndex ? 'right' : 'left';
      setHoverDirection(direction);
    }
  };

  const isCellInRange = (rowIndex: number, colIndex: number) => {
    if (!selectedCell || !hoveredCell) return false;
    if (rowIndex !== selectedCell.rowIndex) return false;
    if (hoverDirection === 'right') {
      return colIndex >= selectedCell.colIndex && colIndex <= hoveredCell.colIndex;
    } else {
      return colIndex <= selectedCell.colIndex && colIndex >= hoveredCell.colIndex;
    }
  };


  return (
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-900 pb-3">
      <table className="min-w-full">

        <thead>
          <tr>
            {months.map(([month, count]) => (
              <th key={month} colSpan={count} className="p-1 border border-r-2 border-l-2 border-gray-500">
                {getMonthName(year, month)}
              </th>
            ))}
          </tr>
          <tr>
            {days.map((date,dayIndex) => (
              <th key={date.toISOString()} className={`border-l border-r border-b border-gray-500 ${dayIndex === 0 ? 'border-l-2' : ''} ${isLastDayOfMonth(date) ? 'border-r-2' : ''}`}>
                <div className="text-center">
                  <span className="text-xs font-light block">{getDayName(date)}</span>
                  <span className="text-xs block">{format(date, 'd')}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookingObjects.map((objectId, rowIndex) => (
            <tr key={rowIndex}>
              {days.map((date, colIndex) => (
                <td
                  key={colIndex}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                  className={`cell border-l border-r border-b border-gray-500 ${colIndex === 0 ? 'border-l-2' : ''} ${isCellInRange(rowIndex, colIndex) ? 'highlight' : ''} ${selectedCell?.rowIndex === rowIndex && selectedCell?.colIndex === colIndex ? 'selected' : ''
                    }  ${isLastDayOfMonth(date) ? 'border-r-2' : ''}`}
                >
                  <div
                    className={`px-3 h-6 cursor-pointer`}
                    data-object-id={objectId}
                    data-date-string={formatDate(date)}
                  >
                    {/* This is the clickable/selectable cell */}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableWithDateRange;
