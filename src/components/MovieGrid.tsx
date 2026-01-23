import { useState, useMemo } from "react";
import { movies } from "@/data/movies";
import MovieCard from "./MovieCard";
import GenreFilter from "./GenreFilter";

const MovieGrid = () => {
  const [selectedGenre, setSelectedGenre] = useState("All");

  const filteredMovies = useMemo(() => {
    if (selectedGenre === "All") return movies;
    return movies.filter((movie) => movie.genre.includes(selectedGenre));
  }, [selectedGenre]);

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
