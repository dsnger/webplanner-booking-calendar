import { ScrollContainerRefs } from "./BookingCalendarScrollContainer";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface MonthDropdownProps {
  scrollRef: React.RefObject<ScrollContainerRefs>;
  months: { year: number; month: number; count: number }[]; // Assuming this structure from earlier discussions
}

const MonthDropdown: React.FC<MonthDropdownProps> = ({ scrollRef, months }) => {

  return (
    <div className="flex w-full sm:w-auto justify-center items-center gap-2 p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild >
          <Button variant="secondary">Zum Monat ...</Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="max-h-[200px] overflow-auto" >
          {months.map(({ year, month }) => (
            <DropdownMenuItem  key={`${year}-${month + 1}`}
            onClick={() => scrollRef.current?.scrollToMonth(year, month + 1)}>
             
              {new Date(year, month).toLocaleString('default', { month: 'short' })} {year}
           
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MonthDropdown;
