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
  const viewBoxWidth = 31.2;
  const viewBoxHeight = 30.5;
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
      <path stroke={iconStroke} fill={iconFill} d="M4 4.1L4 18.1 18 4.1z"></path>
    </svg>
  );
  }
);
export default DepartureDayIcon;
