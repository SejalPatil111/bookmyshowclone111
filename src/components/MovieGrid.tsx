import { useState, useMemo } from "react";
import { useMovies } from "@/hooks/useMovies";
import MovieCard from "./MovieCard";
import GenreFilter from "./GenreFilter";

const genres = ["All", "Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller"] as const;

const MovieGrid = () => {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const { data: movies, isLoading, error } = useMovies();

  const filteredMovies = useMemo(() => {
    if (!movies) return [];
    if (selectedGenre === "All") return movies;
    return movies.filter((movie) => movie.genre?.includes(selectedGenre));
  }, [selectedGenre, movies]);

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center py-16">
            <div className="animate-pulse text-muted-foreground">Loading movies...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center py-16">
            <p className="text-destructive">Failed to load movies. Please try again.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-2">
              Now Showing
            </h2>
            <p className="text-muted-foreground">
              Book tickets for the latest movies in theaters
            </p>
          </div>
          <GenreFilter
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
          />
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Empty State */}
        {filteredMovies.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No movies found in this genre.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieGrid;
