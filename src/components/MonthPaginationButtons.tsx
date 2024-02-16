import { ScrollContainerRefs } from "./BookingCalendarScrollContainer";

interface MonthPaginationButtonsProps {
  scrollRef: React.RefObject<ScrollContainerRefs>;
  months: { year: number; month: number; count: number }[]; // Assuming this structure from earlier discussions
}

const MonthPaginationButtons: React.FC<MonthPaginationButtonsProps> = ({ scrollRef, months }) => {

  return (
    <div className="flex justify-center items-center gap-2 p-2">
      {months.map(({ year, month }) => (
        <button
          key={`${year}-${month}`}
          onClick={() => scrollRef.current?.scrollToMonth(year, month)}
          className="px-4 py-2 border rounded text-sm font-medium hover:bg-gray-100"
        >
          {new Date(year, month).toLocaleString('default', { month: 'short' })} {year}
        </button>
      ))}
    </div>
  );
};

export default MonthPaginationButtons;