import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, Minus, Plus, CreditCard, Check, Loader2 } from "lucide-react";
import { Movie } from "@/hooks/useMovies";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateBooking, useUpdateBookingStatus, processMockPayment, sendBookingConfirmationEmail } from "@/hooks/useBookings";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

type BookingStep = "select" | "payment" | "confirmation";

const BookingModal = ({ movie, isOpen, onClose }: BookingModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const updateBookingStatus = useUpdateBookingStatus();

  const [step, setStep] = useState<BookingStep>("select");
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [seats, setSeats] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const totalAmount = (movie.price || 12.99) * seats;

  const handleClose = () => {
    setStep("select");
    setSelectedTime("");
    setSeats(1);
    setBookingId(null);
    onClose();
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

    if (!selectedTime) {
      toast({
        title: "Select a show time",
        description: "Please select a show time to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const booking = await createBooking.mutateAsync({
        movie_id: movie.id,
        show_time: selectedTime,
        show_date: format(selectedDate, "yyyy-MM-dd"),
        seats,
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

  const handlePayment = async () => {
    if (!bookingId) return;

    setIsProcessing(true);

    try {
      // First update to confirmed
      await updateBookingStatus.mutateAsync({
        bookingId,
        status: "confirmed",
      });

      // Process mock payment
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground">
            {step === "select" && "Book Tickets"}
            {step === "payment" && "Payment"}
            {step === "confirmation" && "Booking Confirmed!"}
          </DialogTitle>
        </DialogHeader>

        {step === "select" && (
          <div className="space-y-6">
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

            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-secondary border-border"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP")}
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

            {/* Time Selection */}
            <div className="space-y-2">
              <Label>Select Show Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {movie.show_times?.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Seats Selection */}
            <div className="space-y-2">
              <Label>Number of Seats</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                  disabled={seats <= 1}
                  className="bg-secondary border-border"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-2xl font-bold text-foreground w-12 text-center">
                  {seats}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSeats(Math.min(10, seats + 1))}
                  disabled={seats >= 10}
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

            {/* Action Button */}
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={handleBooking}
              disabled={isProcessing || !selectedTime}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </Button>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-secondary rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Movie</span>
                <span className="text-foreground">{movie.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="text-foreground">{format(selectedDate, "PPP")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="text-foreground">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats</span>
                <span className="text-foreground">{seats}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-primary text-xl">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Mock Payment Card */}
            <div className="bg-secondary rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-primary" />
                <span className="text-foreground font-medium">Mock Payment</span>
              </div>
              <p className="text-muted-foreground text-sm">
                This is a simulated payment. Click "Pay Now" to complete the booking.
              </p>
            </div>

            {/* Payment Button */}
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing Payment...
                </>
              ) : (
                `Pay $${totalAmount.toFixed(2)}`
              )}
            </Button>
          </div>
        )}

        {step === "confirmation" && (
          <div className="space-y-6 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-10 h-10 text-green-500" />
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
                <span className="text-muted-foreground">Date</span>
                <span className="text-foreground">{format(selectedDate, "PPP")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="text-foreground">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats</span>
                <span className="text-foreground">{seats}</span>
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
