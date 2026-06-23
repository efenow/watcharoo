import { Link, useLocation } from "wouter";
import { CountrySelector } from "./CountrySelector";
import { Search } from "lucide-react";
import rectangleLogoPath from "@assets/RECTANGLE_LOGOMARK_TEXT_1782213400533.png";

export function Navbar() {
  const [, setLocation] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 mx-auto">
        <Link href="/" className="flex items-center gap-2" data-testid="link-home">
          <img src={rectangleLogoPath} alt="Watcharoo" className="h-9" />
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/search")}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            data-testid="button-nav-search"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <CountrySelector />
        </div>
      </div>
    </header>
  );
}
