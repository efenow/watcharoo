import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/tmdb";
import { MediaCard } from "@/components/MediaCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Search() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get("q") || "";
  const [search, setSearch] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setLocation(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["search", initialQuery],
    queryFn: () => api.searchMulti(initialQuery),
    enabled: !!initialQuery,
  });

  const filterResults = (results: any[] | undefined) => {
    if (!results) return [];
    if (activeTab === "movies") return results.filter(r => r.media_type === "movie");
    if (activeTab === "tv") return results.filter(r => r.media_type === "tv");
    return results.filter(r => r.media_type === "movie" || r.media_type === "tv");
  };

  const results = filterResults(data?.results);

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
      <form onSubmit={handleSearch} className="relative flex items-center max-w-3xl mx-auto mb-12">
        <SearchIcon className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input 
          type="text" 
          placeholder="Search for movies or TV shows..." 
          className="w-full h-14 pl-12 pr-28 text-lg rounded-xl bg-card border-border/50 focus-visible:ring-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="input-search-page"
        />
        <Button 
          type="submit" 
          className="absolute right-2 h-10 rounded-lg px-6 font-semibold"
          data-testid="button-search-page"
        >
          Search
        </Button>
      </form>

      {initialQuery && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Search results for "{initialQuery}"</h2>
            <TabsList className="bg-card border border-border/50">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="movies">Movies</TabsTrigger>
              <TabsTrigger value="tv">TV Shows</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {results.map((item: any) => (
                  <MediaCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl border border-border/50">
                <p className="text-xl text-muted-foreground">No results found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}