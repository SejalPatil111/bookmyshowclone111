import { Play, Star, Clock, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { useFeaturedMovie } from "@/hooks/useMovies";
import { useState } from "react";
import BookingModal from "./BookingModal";

const HeroSection = () => {
  const { data: featuredMovie, isLoading } = useFeaturedMovie();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (isLoading || !featuredMovie) {
    return (
      <section className="relative min-h-[90vh] flex items-center bg-background">
        <div className="container">
          <div className="animate-pulse text-muted-foreground">Loading featured movie...</div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={featuredMovie.backdrop || "/placeholder.svg"}
            alt={featuredMovie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </div>

        {/* Content */}
        <div className="container relative z-10 pt-20 md:pt-0">
          <div className="max-w-2xl animate-slide-up">
            {/* Featured Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Featured This Week</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground mb-4 leading-none">
              {featuredMovie.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent fill-accent" />
                <span className="text-foreground font-semibold">{featuredMovie.rating}/10</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{featuredMovie.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{featuredMovie.release_date}</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {featuredMovie.genre?.map((g) => (
                <span key={g} className="px-3 py-1 rounded-full bg-secondary text-foreground/80 text-sm">
                  {g}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {featuredMovie.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group" onClick={() => setIsBookingOpen(true)}>
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Book Tickets
              </Button>
              <Button variant="glass" size="xl">
                Watch Trailer
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Poster (Desktop) */}
        <div className="hidden lg:block absolute right-[10%] top-1/2 -translate-y-1/2 animate-scale-in">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-primary rounded-2xl opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />
            <img
              src={featuredMovie.poster || "/placeholder.svg"}
              alt={featuredMovie.title}
              className="relative w-72 rounded-xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      <BookingModal
        movie={featuredMovie}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  );
};

export default HeroSection;
