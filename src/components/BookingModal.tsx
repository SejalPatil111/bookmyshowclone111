import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, Minus, Plus, Check, Loader2, MapPin, Clock, Film, Ticket, Receipt } from "lucide-react";
import { Movie } from "@/hooks/useMovies";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateBooking, useUpdateBookingStatus, processMockPayment, sendBookingConfirmationEmail } from "@/hooks/useBookings";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { theaters, getTheaterShowtimes, Theater } from "@/data/theaters";
import SeatSelector from "@/components/SeatSelector";
import PaymentForm, { PaymentMethod } from "@/components/PaymentForm";

interface BookingModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

type BookingStep = "theater" | "ticket-count" | "seats" | "payment" | "confirmation";

const BookingModal = ({ movie, isOpen, onClose }: BookingModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const updateBookingStatus = useUpdateBookingStatus();

  const [step, setStep] = useState<BookingStep>("theater");
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1));
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const theaterShowtimes = useMemo(
    () => getTheaterShowtimes(movie.show_times),
    [movie.show_times]
  );

  const totalAmount = (movie.price || 12.99) * ticketCount;

  const handleClose = () => {
    setStep("theater");
    setSelectedTheater(null);
    setSelectedTime("");
    setSelectedFormat("");
    setTicketCount(1);
    setSelectedSeats([]);
    setBookingId(null);
    onClose();
  };

  const handleSelectShowtime = (theater: Theater, time: string, format: string) => {
    setSelectedTheater(theater);
    setSelectedTime(time);
    setSelectedFormat(format);
    setSelectedSeats([]); // Reset seat selection when changing showtime
    setStep("ticket-count");
  };

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to book tickets.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!selectedTime || !selectedTheater) {
      toast({
        title: "Select a show time",
        description: "Please select a theater and show time to continue.",
        variant: "destructive",
      });
      return;
    }

    if (selectedSeats.length !== ticketCount) {
      toast({
        title: "Select seats",
        description: `Please select ${ticketCount} seat(s) to continue.`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const booking = await createBooking.mutateAsync({
        movie_id: movie.id,
        show_time: `${selectedTime} (${selectedFormat}) - ${selectedTheater.name} - Seats: ${selectedSeats.sort().join(", ")}`,
        show_date: format(selectedDate, "yyyy-MM-dd"),
        seats: ticketCount,
        total_amount: totalAmount,
      });

      setBookingId(booking.id);
      setStep("payment");
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async (method: PaymentMethod) => {
    if (!bookingId) return;

    setIsProcessing(true);

    try {
      // First update to confirmed
      await updateBookingStatus.mutateAsync({
        bookingId,
        status: "confirmed",
      });

      // Process mock payment with selected method
      toast({
        title: `Processing ${method.replace("-", " ")} payment...`,
        description: "Please wait while we process your payment.",
      });

      const paymentId = await processMockPayment(totalAmount);

      // Update to paid with payment ID
      await updateBookingStatus.mutateAsync({
        bookingId,
        status: "paid",
        paymentId,
      });

      // Send mock confirmation email
      sendBookingConfirmationEmail(
        { id: bookingId } as any,
        movie.title
      );

      setStep("confirmation");
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "Something went wrong with the payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getTheaterById = (id: string) => theaters.find((t) => t.id === id);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground">
            {step === "theater" && `Theaters Showing ${movie.title}`}
            {step === "ticket-count" && "How Many Tickets?"}
            {step === "seats" && "Select Your Seats"}
            {step === "payment" && "Payment"}
            {step === "confirmation" && "Booking Confirmed!"}
          </DialogTitle>
        </DialogHeader>

        {step === "theater" && (
          <div className="space-y-6">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label className="text-base">Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-secondary border-border"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card border-border">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Theaters List */}
            <div className="space-y-4">
              {theaters.map((theater) => {
                const showtimeData = theaterShowtimes.find(
                  (ts) => ts.theaterId === theater.id
                );

                return (
                  <div
                    key={theater.id}
                    className="bg-secondary/50 rounded-xl p-4 border border-border hover:border-primary/50 transition-colors"
                  >
                    {/* Theater Info */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-lg">
                          {theater.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {theater.location}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {theater.amenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Showtimes */}
                    <div className="flex flex-wrap gap-2">
                      {showtimeData?.times.map((showtime, index) => (
                        <Button
                          key={`${theater.id}-${showtime.time}-${index}`}
                          variant="outline"
                          size="sm"
                          disabled={!showtime.available}
                          onClick={() =>
                            handleSelectShowtime(
                              theater,
                              showtime.time,
                              showtime.format
                            )
                          }
                          className={cn(
                            "flex-col h-auto py-2 px-4 gap-0.5 border-border",
                            showtime.available
                              ? "hover:bg-primary hover:text-primary-foreground hover:border-primary"
                              : "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <span className="font-semibold">{showtime.time}</span>
                          <span className="text-xs text-muted-foreground">
                            {showtime.format}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === "ticket-count" && (
          <div className="space-y-6">
            {/* Selected Theater & Time Info */}
            <div className="bg-secondary rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{selectedTheater?.name}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{format(selectedDate, "EEEE, MMM d")}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {selectedTime} ({selectedFormat})
                </span>
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex gap-4">
              <img
                src={movie.poster || "/placeholder.svg"}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-display text-xl text-foreground">{movie.title}</h3>
                <p className="text-muted-foreground text-sm">{movie.duration}</p>
                <p className="text-primary font-semibold mt-2">
                  ${movie.price?.toFixed(2)} per ticket
                </p>
              </div>
            </div>

            {/* Ticket Count Selection */}
            <div className="space-y-2">
              <Label>Number of Tickets</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setTicketCount(Math.max(1, ticketCount - 1));
                    setSelectedSeats([]);
                  }}
                  disabled={ticketCount <= 1}
                  className="bg-secondary border-border"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-2xl font-bold text-foreground w-12 text-center">
                  {ticketCount}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setTicketCount(Math.min(10, ticketCount + 1));
                    setSelectedSeats([]);
                  }}
                  disabled={ticketCount >= 10}
                  className="bg-secondary border-border"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="text-2xl font-bold text-foreground">
                ${totalAmount.toFixed(2)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("theater")}
              >
                Back
              </Button>
              <Button
                variant="hero"
                size="lg"
                className="flex-1"
                onClick={() => setStep("seats")}
              >
                Select Seats
              </Button>
            </div>
          </div>
        )}

        {step === "seats" && (
          <div className="space-y-6">
            {/* Selected Theater & Time Info */}
            <div className="bg-secondary rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{selectedTheater?.name}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{format(selectedDate, "EEEE, MMM d")}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {selectedTime} ({selectedFormat})
                </span>
                <span>• {ticketCount} ticket(s)</span>
              </div>
            </div>

            {/* Seat Selector */}
            <SeatSelector
              maxSeats={ticketCount}
              selectedSeats={selectedSeats}
              onSeatSelect={setSelectedSeats}
              theaterId={selectedTheater?.id || ""}
              showtime={selectedTime}
            />

            {/* Total */}
            <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="text-2xl font-bold text-foreground">
                ${totalAmount.toFixed(2)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("ticket-count")}
              >
                Back
              </Button>
              <Button
                variant="hero"
                size="lg"
                className="flex-1"
                onClick={handleBooking}
                disabled={isProcessing || selectedSeats.length !== ticketCount}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : selectedSeats.length !== ticketCount ? (
                  `Select ${ticketCount - selectedSeats.length} more seat(s)`
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-6">
            {/* Booking Summary Header */}
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Receipt className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Booking Summary</h3>
              </div>
              
              <div className="flex gap-4">
                <img
                  src={movie.poster || "/placeholder.svg"}
                  alt={movie.title}
                  className="w-16 h-24 object-cover rounded-lg"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{movie.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedTheater?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{format(selectedDate, "EEE, MMM d")} • {selectedTime} ({selectedFormat})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Ticket className="w-3 h-3" />
                    <span>{ticketCount} ticket(s) • Seats: {selectedSeats.sort().join(", ")}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-primary/20 flex justify-between items-center">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="text-2xl font-bold text-primary">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Form */}
            <PaymentForm
              totalAmount={totalAmount}
              isProcessing={isProcessing}
              onSubmit={handlePayment}
              onBack={() => setStep("seats")}
            />
          </div>
        )}

        {step === "confirmation" && (
          <div className="space-y-6 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
              <Check className="w-10 h-10 text-primary" />
            </div>

            {/* Success Message */}
            <div>
              <h3 className="font-display text-2xl text-foreground mb-2">
                Booking Confirmed!
              </h3>
              <p className="text-muted-foreground">
                Your tickets for <span className="text-foreground">{movie.title}</span> have been booked successfully.
              </p>
            </div>

            {/* Booking Details */}
            <div className="bg-secondary rounded-lg p-4 space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Theater</span>
                <span className="text-foreground text-right text-sm">
                  {selectedTheater?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="text-foreground">{format(selectedDate, "PPP")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="text-foreground">
                  {selectedTime} ({selectedFormat})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats</span>
                <span className="text-foreground">{selectedSeats.sort().join(", ")}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/my-bookings")}
              >
                View My Bookings
              </Button>
              <Button variant="hero" className="flex-1" onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
