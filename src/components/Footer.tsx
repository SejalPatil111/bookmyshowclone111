const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <span className="font-display text-xl text-primary-foreground">B</span>
              </div>
              <span className="font-display text-2xl text-foreground">BookMyShow</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your one-stop destination for movies, events, and entertainment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-4">Movies</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Now Showing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Coming Soon</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Top Rated</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Trending</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
            </ul>
          </div>

          {/* Download */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-4">Download App</h4>
            <div className="space-y-3">
              <button className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors text-left">
                📱 App Store
              </button>
              <button className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors text-left">
                🤖 Play Store
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 BookMyShow. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
