import { Star, Clock, Play } from "lucide-react";
import { Movie } from "@/data/movies";
import { Button } from "./ui/button";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div className="group relative rounded-xl overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-all duration-500 animate-fade-in">
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-card opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
          <span className="text-sm font-semibold text-foreground">{movie.rating}</span>
        </div>

        {/* Play Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <Button variant="hero" size="lg" className="gap-2">
            <Play className="w-4 h-4" />
            Book Now
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-xl text-foreground mb-2 truncate group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>{movie.duration}</span>
          <span className="text-border">•</span>
          <span>{movie.language}</span>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1.5">
          {movie.genre.slice(0, 2).map((g) => (
            <span
              key={g}
              className="px-2 py-0.5 rounded-full bg-secondary text-xs text-muted-foreground"
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
