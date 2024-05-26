import React, { useEffect, useState } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface RangeMarkerProps {
  index: number;
  start: Date;
  end: Date;
  starthalf?: boolean;
  endhalf?: boolean;
  type?: string;
  tooltip?: string;
  days: Date[];
}


const RangeMarkerSVG: React.FC<RangeMarkerProps> = ({ index, start, end, tooltip, days }) => {
  const [cellWidth, setCellWidth] = useState(32);
  const [cellGap, setCellGap] = useState(1); // Default cell width to 40 if not set in CSS

  useEffect(() => {
    const root = document.documentElement;
    const computedCellWidth = parseFloat(getComputedStyle(root).getPropertyValue('--cell-width'));
    if (!isNaN(computedCellWidth)) {
      setCellWidth(computedCellWidth);
    }
    const computedCellGap = parseFloat(getComputedStyle(root).getPropertyValue('--cell-gap'));
    if (!isNaN(computedCellGap)) {
      setCellGap(computedCellGap);
    }
  }, []);

  const getColumnStart = (date: Date) => days.findIndex(day => differenceInCalendarDays(day, date) === 0) + 1;
  const getColumnEnd = (date: Date) => days.findIndex(day => differenceInCalendarDays(day, date) === 0) + 2;

  const columnStart = getColumnStart(start);
  const columnEnd = getColumnEnd(end);
  const numberOfColumns = columnEnd - columnStart;
  const svgWidth = numberOfColumns * cellWidth + (numberOfColumns * cellGap);
  const svgHeight = cellWidth;

  const calculatePath = (cellWidth: number, numberOfColumns: number) => {
    const scale = cellWidth * (numberOfColumns - 2) + (numberOfColumns * cellGap)
    const points = [
      { x: 59.43875 + scale, y: 2 }, // Scaled
      { x: 31.43875 + scale, y: 30 }, // Unchanged
      { x: 4.56125, y: 30 }, // Unchanged
      { x: 32.56125, y: 2 } // Unchanged
    ];
    return `M ${points[0].x} ${points[0].y}L ${points[1].x} ${points[1].y}L ${points[2].x} ${points[2].y}L ${points[3].x} ${points[3].y}Z`;
  };

  const calculateStrokePath = (cellWidth: number, numberOfColumns: number) => {
    const scale = cellWidth * (numberOfColumns - 2) + (numberOfColumns * cellGap)
    const points = [
      { x: 46 + (scale/2), y: 2 }, // Scaled
      { x: 59.43875 + scale, y: 2 }, // Scaled
      { x: 31.43875 + scale, y: 30 }, // Unchanged
      { x: 4.56125, y: 30 }, // Unchanged
      { x: 32.56125, y: 2 }, // Unchanged
      { x: 46 + (scale/2), y: 2 } // Scaled
    ];
    return `M ${points[0].x} ${points[0].y}L ${points[1].x} ${points[1].y}L ${points[2].x} ${points[2].y}L ${points[3].x} ${points[3].y}L ${points[4].x} ${points[4].y}L ${points[5].x} ${points[5].y}`;
  };

  return (
    <div
      className="h-cell-height relative stroke-current [fill-opacity:0.35] "
      style={{
        gridColumnStart: columnStart,
        gridColumnEnd: columnEnd,
        gridRow: index + 1,
        display: 'block',
      }}
    >
      <svg className="absolute inset-0 h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`} xmlns="http://www.w3.org/2000/svg">
        <path stroke="none" d={calculatePath(cellWidth,numberOfColumns)}></path>
        <path fill="none" strokeLinejoin="round" strokeWidth="2" d={calculateStrokePath(cellWidth,numberOfColumns)}></path>
      </svg>
      {tooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-8 min-w-8 m-0 p-0 flex">
                <div
                  className={`cell-marker w-full h-full `}
                >
                  {tooltip}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : ''}
    </div>
  );
};


export default RangeMarkerSVG;
