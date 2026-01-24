import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface SeatSelectorProps {
  maxSeats: number;
  selectedSeats: string[];
  onSeatSelect: (seats: string[]) => void;
  theaterId: string;
  showtime: string;
}

interface Seat {
  id: string;
  row: string;
  number: number;
  isAvailable: boolean;
}

// Generate mock seat data based on theater and showtime
const generateSeats = (theaterId: string, showtime: string): Seat[] => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 12;
  const seats: Seat[] = [];

  // Use theater and showtime to create deterministic "random" filled seats
  const hash = (theaterId + showtime).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  rows.forEach((row) => {
    for (let num = 1; num <= seatsPerRow; num++) {
      const seatId = `${row}${num}`;
      // Create a pattern of filled seats based on hash
      const seatHash = (hash + row.charCodeAt(0) + num) % 10;
      const isAvailable = seatHash > 2; // ~70% available

      seats.push({
        id: seatId,
        row,
        number: num,
        isAvailable,
      });
    }
  });

  return seats;
};

const SeatSelector = ({
  maxSeats,
  selectedSeats,
  onSeatSelect,
  theaterId,
  showtime,
}: SeatSelectorProps) => {
  const seats = useMemo(
    () => generateSeats(theaterId, showtime),
    [theaterId, showtime]
  );

  const rows = useMemo(() => {
    const rowMap = new Map<string, Seat[]>();
    seats.forEach((seat) => {
      if (!rowMap.has(seat.row)) {
        rowMap.set(seat.row, []);
      }
      rowMap.get(seat.row)!.push(seat);
    });
    return Array.from(rowMap.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
  }, [seats]);

  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable) return;

    if (selectedSeats.includes(seat.id)) {
      // Deselect seat
      onSeatSelect(selectedSeats.filter((s) => s !== seat.id));
    } else if (selectedSeats.length < maxSeats) {
      // Select seat
      onSeatSelect([...selectedSeats, seat.id]);
    }
  };

  const availableCount = seats.filter((s) => s.isAvailable).length;

  return (
    <div className="space-y-6">
      {/* Screen */}
      <div className="relative">
        <div className="w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
        <p className="text-center text-xs text-muted-foreground mt-2">SCREEN</p>
      </div>

      {/* Seat Grid */}
      <div className="flex flex-col items-center gap-2 py-4">
        {rows.map(([rowLabel, rowSeats]) => (
          <div key={rowLabel} className="flex items-center gap-1">
            {/* Row Label */}
            <span className="w-6 text-xs font-medium text-muted-foreground text-right">
              {rowLabel}
            </span>

            {/* Seats */}
            <div className="flex gap-1">
              {rowSeats.map((seat, index) => {
                const isSelected = selectedSeats.includes(seat.id);
                const isMiddleAisle = index === 5; // Gap after 6th seat

                return (
                  <div key={seat.id} className={cn("flex", isMiddleAisle && "mr-4")}>
                    <button
                      onClick={() => handleSeatClick(seat)}
                      disabled={!seat.isAvailable}
                      className={cn(
                        "w-7 h-7 rounded-t-lg text-xs font-medium transition-all duration-200",
                        "flex items-center justify-center",
                        !seat.isAvailable && [
                          "bg-muted/60 text-muted-foreground/40 cursor-not-allowed",
                          "border border-muted-foreground/20",
                        ],
                        seat.isAvailable &&
                          !isSelected && [
                            "border-2 border-success text-success",
                            "hover:bg-success/20 hover:scale-105",
                            "cursor-pointer",
                          ],
                        isSelected && [
                          "bg-success text-success-foreground border-2 border-success",
                          "scale-105 shadow-lg shadow-success/30",
                        ]
                      )}
                      title={
                        !seat.isAvailable
                          ? "Seat unavailable"
                          : isSelected
                          ? "Click to deselect"
                          : selectedSeats.length >= maxSeats
                          ? `Maximum ${maxSeats} seats allowed`
                          : "Click to select"
                      }
                    >
                      {seat.number}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Row Label (right side) */}
            <span className="w-6 text-xs font-medium text-muted-foreground text-left">
              {rowLabel}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md border-2 border-success" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-success border-2 border-success" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-muted/60 border border-muted-foreground/20" />
          <span className="text-muted-foreground">Filled</span>
        </div>
      </div>

      {/* Selection Info */}
      <div className="bg-secondary rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Available Seats</span>
          <span className="text-foreground">{availableCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Selected ({selectedSeats.length}/{maxSeats})
          </span>
          <span className="text-success font-medium">
            {selectedSeats.length > 0 ? selectedSeats.sort().join(", ") : "None"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
