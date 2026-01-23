import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <span className="font-display text-xl text-primary-foreground">B</span>
            </div>
            <span className="font-display text-2xl md:text-3xl text-foreground tracking-wide">
              BookMyShow
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Movies
            </a>
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Events
            </a>
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Plays
            </a>
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Sports
            </a>
          </div>

          {/* Search & Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search movies..."
                className="w-64 h-10 pl-10 pr-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <Button variant="hero" size="default">
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <a href="#" className="text-foreground/80 hover:text-primary transition-colors py-2">
                Movies
              </a>
              <a href="#" className="text-foreground/80 hover:text-primary transition-colors py-2">
                Events
              </a>
              <a href="#" className="text-foreground/80 hover:text-primary transition-colors py-2">
                Plays
              </a>
              <a href="#" className="text-foreground/80 hover:text-primary transition-colors py-2">
                Sports
              </a>
              <Button variant="hero" size="default" className="w-full">
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
