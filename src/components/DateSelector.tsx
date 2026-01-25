import { format, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  daysToShow?: number;
}

const DateSelector = ({ selectedDate, onDateSelect, daysToShow = 14 }: DateSelectorProps) => {
  const today = new Date();
  const dates = Array.from({ length: daysToShow }, (_, i) => addDays(today, i));

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-3">
        {dates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateSelect(date)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[70px] h-[80px] rounded-xl border-2 transition-all duration-200",
                "hover:border-primary/70 hover:bg-primary/10",
                isSelected
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border bg-secondary/50 text-muted-foreground"
              )}
            >
              <span className={cn(
                "text-xs font-medium uppercase",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}>
                {isToday ? "Today" : format(date, "EEE")}
              </span>
              <span className={cn(
                "text-2xl font-bold",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {format(date, "d")}
              </span>
              <span className={cn(
                "text-xs",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}>
                {format(date, "MMM")}
              </span>
            </button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default DateSelector;
