import React, { useEffect, useState } from 'react';
import { differenceInCalendarDays } from 'date-fns';

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
  const [cellWidth, setCellWidth] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    const computedCellWidth = parseFloat(getComputedStyle(root).getPropertyValue('--cell-width'));
    setCellWidth(computedCellWidth);
  }, []);

  const getColumnStart = (date: Date) => days.findIndex(day => differenceInCalendarDays(day, date) === 0) + 1;
  const getColumnEnd = (date: Date) => days.findIndex(day => differenceInCalendarDays(day, date) === 0) + 2;

  const columnStart = getColumnStart(start);
  const columnEnd = getColumnEnd(end);
  const numberOfColumns = columnEnd - columnStart;

  return (
    <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 33 33"
      style={{
        gridColumnStart: columnStart,
        gridColumnEnd: columnStart +1,
        gridRow: index + 1,
        display: 'block',
      }}
    >
      <path
        d="M32.5 32.5H3.47c-2.55 0-3.91-3.04-2.23-4.98L23.12 2.21A4.9 4.9 0 0126.84.5h5.66v32z"
        style={{ isolation: "isolate" }}
        fill="#31ff00"
        stroke="#a03535"
        strokeMiterlimit="10"
        opacity="0.25"
      ></path>
    </svg>
    {numberOfColumns > 2 && (
      <rect
        x={cellWidth}
        y="0"
        width={`calc(100% - 2 * ${cellWidth}px)`}
        height="100%"
        fill="rgba(255, 0, 0, 0.8)"
        stroke="#f00"
        strokeWidth="1"
      />
    )}
        {numberOfColumns > 1 && (
          <svg
            width="32"
            height="32"
            viewBox="0 0 33 33"
            style={{
              gridColumnStart: columnEnd - 1,
              gridColumnEnd: columnEnd,
              gridRow: index + 1,
              display: 'block',
            }}
          >
            <path
              d="M.5.5h29.03c2.55 0 3.91 3.04 2.23 4.98L9.88 30.79a4.9 4.9 0 01-3.72 1.71H.5V.5z"
              style={{ isolation: "isolate" }}
              fill="#000"
              stroke="#000"
              strokeMiterlimit="10"
              opacity="0.25"
            ></path>
          </svg>
        )}

    </>
  );
};


export default RangeMarkerSVG;
