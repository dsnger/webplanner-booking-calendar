import React from 'react';
import { differenceInCalendarDays } from 'date-fns';
import { useSettings } from '@/hooks/useSettings';

interface RangeMarkerProps {
  index: number;
  start: Date;
  end: Date;
  starthalf: boolean;
  endhalf: boolean;
  days: Date[];
  type?: string;
  isSelecting: boolean;
}

const RangeMarkerSVG: React.FC<RangeMarkerProps> = ({ index, start, end, starthalf, endhalf, days, type, isSelecting = false}) => {
  const { calendarSettings } = useSettings();
  const cellWidth = parseFloat(calendarSettings[0].cellSettings.cellWidth);
  const cellGap = parseFloat(calendarSettings[0].cellSettings.cellGap);

  const getColumnStart = (date: Date) => days.findIndex(day => differenceInCalendarDays(day, date) === 0) + 1;
  const getColumnEnd = (date: Date) => days.findIndex(day => differenceInCalendarDays(day, date) === 0) + 2;

  const columnStart = getColumnStart(start);
  const columnEnd = end ? getColumnEnd(end) : columnStart + 1;
  const numberOfColumns = columnEnd - columnStart;
  const svgWidth = numberOfColumns * cellWidth + (numberOfColumns * cellGap);
  const svgHeight = cellWidth;

  const calculateHalfStartHalfEndPath = (cellWidth: number, numberOfColumns: number) => {
    const scale = cellWidth * (numberOfColumns - 2) + (numberOfColumns * cellGap);
    const svgBaseWidth = cellWidth - 2;
    const svgBaseHeight = cellWidth;
    const points = [
      { x: svgBaseWidth + (scale / 2), y: 2 },
      { x: svgBaseWidth * 2 + scale, y: 2 },
      { x: svgBaseWidth + scale, y: svgBaseHeight - 2 },
      { x: 0, y: svgBaseHeight - 2 },
      { x: svgBaseWidth, y: 2 },
      { x: svgBaseWidth + (scale / 2), y: 2 }
    ];
    return `M ${points[0].x} ${points[0].y}L ${points[1].x} ${points[1].y}L ${points[2].x} ${points[2].y}L ${points[3].x} ${points[3].y}L ${points[4].x} ${points[4].y}L ${points[5].x} ${points[5].y}`;
  };

  const calculateFullStartFullEndPath = (cellWidth: number, numberOfColumns: number) => {
    const scale = cellWidth * (numberOfColumns - 2) + (numberOfColumns * cellGap);
    const svgBaseWidth = cellWidth - 1;
    const svgBaseHeight = cellWidth;
    const points = [
      { x: svgBaseWidth + (scale / 2), y: 2 },
      { x: svgBaseWidth * 2 + scale, y: 2 },
      { x: svgBaseWidth * 2 + scale, y: svgBaseHeight - 2 },
      { x: 2, y: svgBaseHeight - 2 },
      { x: 2, y: 2 },
      { x: svgBaseWidth + (scale / 2), y: 2 }
    ];
    return `M ${points[0].x} ${points[0].y}L ${points[1].x} ${points[1].y}L ${points[2].x} ${points[2].y}L ${points[3].x} ${points[3].y}L ${points[4].x} ${points[4].y}L ${points[5].x} ${points[5].y}`;
  };

  const pathData = (starthalf && endhalf)
    ? calculateHalfStartHalfEndPath(cellWidth, numberOfColumns)
    : calculateFullStartFullEndPath(cellWidth, numberOfColumns);


  return (
    <div
      className={`h-cell-height relative stroke-current text-day-${type?.toLowerCase()} fill-day-${type?.toLowerCase()} [fill-opacity:0.65] ${isSelecting ? 'cursor-col-resize z-5' : 'cursor-not-allowed'}`}
      style={{
        gridColumnStart: columnStart,
        gridColumnEnd: columnEnd,
        gridRow: index + 1,
        display: 'block',
      }}
    >
      <svg className="absolute inset-0 h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`} xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={pathData}></path>
      </svg>
    </div>
  );
};

export default RangeMarkerSVG;
