import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/tmdb";
import { MediaCard } from "@/components/MediaCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setLocation(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  const { data: trending, isLoading: isLoadingTrending } = useQuery({
    queryKey: ["trending"],
    queryFn: api.getTrending,
  });

  const { data: popularMovies, isLoading: isLoadingPopularMovies } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: api.getPopularMovies,
  });

  const { data: popularTV, isLoading: isLoadingPopularTV } = useQuery({
    queryKey: ["popularTV"],
    queryFn: api.getPopularTV,
  });

  const renderRow = (title: string, data: any, isLoading: boolean) => (
    <section className="py-8 border-t border-border/50">
      <div className="px-6 md:px-10">
        <h2 className="text-2xl font-bold mb-6 text-foreground tracking-tight">{title}</h2>
        <div className="flex overflow-x-auto pb-3 gap-5 snap-x snap-mandatory watcharoo-scrollbar">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="min-w-[150px] md:min-w-[185px] snap-start shrink-0">
                  <SkeletonCard />
                </div>
              ))
            : data?.results.map((item: any) => (
                <div key={item.id} className="min-w-[150px] md:min-w-[185px] snap-start shrink-0">
                  <MediaCard item={item} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <section className="relative pt-32 pb-40 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <div className="container max-w-3xl mx-auto px-4 z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-white"
          >
            Find where to watch, <span className="text-primary">instantly.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Your cinematic concierge. Search any movie or TV show to see where it's streaming in your country.
          </motion.p>
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch}
            className="flex items-center max-w-2xl mx-auto bg-card border border-border/50 rounded-full shadow-2xl overflow-hidden pr-2"
          >
            <Search className="shrink-0 ml-6 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search movies, TV shows..."
              className="flex-1 h-16 px-4 text-lg bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-home"
            />
            <Button
              type="submit"
              size="lg"
              className="shrink-0 h-12 rounded-full px-8 text-base font-semibold"
              data-testid="button-search-home"
            >
              Search
            </Button>
          </motion.form>
        </div>
      </section>

      <div className="bg-background">
        {renderRow("Trending This Week", trending, isLoadingTrending)}
        {renderRow("Popular Movies", popularMovies, isLoadingPopularMovies)}
        {renderRow("Popular TV Shows", popularTV, isLoadingPopularTV)}
      </div>
    </div>
  );
}
