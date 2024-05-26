import { cn } from '@/lib/utils';

type SvgProps = {
  fill?: string;
  stroke?: string;
  cellWidth: number,
  className?: string;
}

const ArrivalDayIcon: React.FC<SvgProps> = ({ fill = 'green', stroke = ' none',  cellWidth, className }) => {

  const viewBoxWidth = 31.2;
  const viewBoxHeight = 30.5;
  const scale = cellWidth / 32;

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width={viewBoxWidth * scale}
      height={viewBoxHeight * scale}
      overflow="visible"
      className={cn('',className)}
    >
      <g>
        <polygon
          fill="none"
          stroke={stroke}
          stroke-linecap="round"
          strokeLinejoin="round"
          stroke-miterlimit="10"
          points="28.4,28.2
		28.4,10.2 10.4,28.2 	"
        />
        <polygon fill={fill} points="28.4,28.2 28.4,10.2 10.4,28.2 	" />
      </g>
    </svg>
  );
};

export default ArrivalDayIcon;
