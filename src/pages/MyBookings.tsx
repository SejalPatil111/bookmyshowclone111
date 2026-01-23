import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useBookings";
import { useMovies } from "@/hooks/useMovies";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ticket, Clock, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  paid: "bg-green-500/20 text-green-500 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-500 border-red-500/30",
};

const MyBookings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const { data: movies } = useMovies();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to view your bookings.
          </p>
          <Button variant="hero" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const getMovieById = (movieId: string) => {
    return movies?.find((m) => m.id === movieId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container py-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <h1 className="font-display text-4xl text-foreground">My Bookings</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your movie bookings
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {bookingsLoading ? (
          <div className="text-center py-16">
            <div className="animate-pulse text-muted-foreground">
              Loading bookings...
            </div>
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="grid gap-4">
            {bookings.map((booking) => {
              const movie = getMovieById(booking.movie_id);
              return (
                <div
                  key={booking.id}
                  className="bg-card border border-border rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 animate-fade-in"
                >
                  {/* Movie Poster */}
                  <div className="flex-shrink-0">
                    <img
                      src={movie?.poster || "/placeholder.svg"}
                      alt={movie?.title || "Movie"}
                      className="w-full md:w-24 h-36 object-cover rounded-lg"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-display text-xl text-foreground">
                        {movie?.title || "Unknown Movie"}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${
                          statusColors[booking.status]
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(booking.show_date), "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{booking.show_time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Ticket className="w-4 h-4" />
                        <span>{booking.seats} seat(s)</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>Cinema Hall 1</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-muted-foreground text-sm">
                        Booked on {format(new Date(booking.created_at), "MMM d, yyyy")}
                      </span>
                      <span className="font-bold text-primary">
                        ${Number(booking.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Ticket className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="font-display text-2xl text-foreground mb-2">
              No Bookings Yet
            </h2>
            <p className="text-muted-foreground mb-6">
              You haven't booked any movies yet. Start exploring!
            </p>
            <Button variant="hero" onClick={() => navigate("/")}>
              Browse Movies
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
