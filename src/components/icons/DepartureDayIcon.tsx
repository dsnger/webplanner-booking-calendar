import { cn } from '@/lib/utils';

type SvgProps = {
  fill?: string;
  stroke?: string;
  cellWidth: number,
  className?: string;
}

const DepartureDayIcon: React.FC<SvgProps> = ({ fill = 'green', stroke = 'none', cellWidth, className }) => {
  const viewBoxWidth = 31.2;
  const viewBoxHeight = 30.5;
  const scale = cellWidth / 32; // Assuming the initial cell size is 32px

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width={viewBoxWidth * scale}
      height={viewBoxHeight * scale}
      overflow="visible"
      className={cn(className)}
    >
      <g>
        <polygon
          fill="none"
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          points={`2.9,2.9 2.9,20.9 20.9,2.9`}
        />
        <polygon
          fill={fill}
          points={`2.9,2.9 2.9,20.9 20.9,2.9`}
        />
      </g>
    </svg>
  );
};
export default DepartureDayIcon;
