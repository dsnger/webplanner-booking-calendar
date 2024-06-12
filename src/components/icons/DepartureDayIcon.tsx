import React from 'react';
import { cn } from '@/lib/utils';

type SvgProps = {
  iconFill?: string;
  iconStroke?: string;
  cellWidth: number;
  className?: string;
};

const DepartureDayIcon = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ iconFill, iconStroke, cellWidth, className }, ref) => {
  const viewBoxWidth = 32;
  const viewBoxHeight = 32;
  const scale = cellWidth / 32;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width={viewBoxWidth * scale}
      height={viewBoxHeight * scale}
      overflow="visible"
      className={cn(className)}

    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke={iconStroke} fill={iconFill} d="M2 6L2 22 20 6z"></path>
    </svg>
  );
  }
);
export default DepartureDayIcon;
