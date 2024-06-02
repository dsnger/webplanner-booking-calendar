import React from 'react';
import { differenceInCalendarDays } from 'date-fns';
import { useSettings } from '@/hooks/useSettings';

interface RangeMarkerProps {
  index: number;
  start: Date;
  end: Date;
  days: Date[];
  type?: string;
  isSelecting: boolean;
}

const RangeMarkerSVG: React.FC<RangeMarkerProps> = ({ index, start, end, days, type, isSelecting = false}) => {
  const { calendarSettings } = useSettings();
  const cellWidth = parseFloat(calendarSettings[0].cellSettings.cellWidth);
  const cellGap = parseFloat(calendarSettings[0].cellSettings.cellGap);

  const getColumnStart = (date: Date) => days.findIndex(day => differenceInCalendarDays(day, date) === 0) + 1;
  const getColumnEnd = (date: Date) => days.findIndex(day => differenceInCalendarDays(day, date) === 0) + 2;

  const columnStart = getColumnStart(start);
  const columnEnd = getColumnEnd(end);
  const numberOfColumns = columnEnd - columnStart;
  const svgWidth = numberOfColumns * cellWidth + (numberOfColumns * cellGap);
  const svgHeight = cellWidth;

  const calculatePath = (cellWidth: number, numberOfColumns: number) => {
    const scale = cellWidth * (numberOfColumns - 2) + (numberOfColumns * cellGap);
    const points = [
      { x: 46 + (scale / 2), y: 2 },
      { x: 59.43875 + scale, y: 2 },
      { x: 31.43875 + scale, y: 30 },
      { x: 4.56125, y: 30 },
      { x: 32.56125, y: 2 },
      { x: 46 + (scale / 2), y: 2 }
    ];
    return `M ${points[0].x} ${points[0].y}L ${points[1].x} ${points[1].y}L ${points[2].x} ${points[2].y}L ${points[3].x} ${points[3].y}L ${points[4].x} ${points[4].y}L ${points[5].x} ${points[5].y}`;
  };

  return (
    <div
      className={`h-cell-height relative stroke-current text-day-${type?.toLowerCase()} fill-day-${type?.toLowerCase()} [fill-opacity:0.65] ${isSelecting ? 'cursor-col-resize' : 'cursor-default pointer-events-none '}`}
      style={{
        gridColumnStart: columnStart,
        gridColumnEnd: columnEnd,
        gridRow: index + 1,
        display: 'block',
      }}
    >
      <svg className="absolute inset-0 h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`} xmlns="http://www.w3.org/2000/svg">
        <path strokeLinejoin="round" strokeWidth="2" d={calculatePath(cellWidth, numberOfColumns)}></path>
      </svg>
    </div>
  );
};

export default RangeMarkerSVG;
