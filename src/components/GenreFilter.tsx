import { genres } from "@/data/movies";
import { cn } from "@/lib/utils";

interface GenreFilterProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

const GenreFilter = ({ selectedGenre, onGenreChange }: GenreFilterProps) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onGenreChange(genre)}
          className={cn(
            "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
            selectedGenre === genre
              ? "bg-gradient-primary text-primary-foreground shadow-glow"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
          )}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
