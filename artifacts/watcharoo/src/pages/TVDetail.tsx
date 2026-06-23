import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { api, getImageUrl } from "@/lib/tmdb";
import { WatchProviders } from "@/components/WatchProviders";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Play, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaCard } from "@/components/MediaCard";

export default function TVDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: tv, isLoading } = useQuery({
    queryKey: ["tv", id],
    queryFn: () => api.getTV(id!),
    enabled: !!id
  });

  const { data: credits } = useQuery({
    queryKey: ["tvCredits", id],
    queryFn: () => api.getTVCredits(id!),
    enabled: !!id
  });

  const { data: videos } = useQuery({
    queryKey: ["tvVideos", id],
    queryFn: () => api.getTVVideos(id!),
    enabled: !!id
  });

  const { data: similar } = useQuery({
    queryKey: ["tvSimilar", id],
    queryFn: () => api.getSimilarTV(id!),
    enabled: !!id
  });

  if (isLoading || !tv) {
    return (
      <div className="min-h-screen">
        <Skeleton className="w-full h-[60vh]" />
        <div className="container max-w-screen-2xl mx-auto px-4 -mt-32 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="w-full aspect-[2/3] rounded-xl" />
          <div className="md:col-span-2 space-y-4 mt-32">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const trailer = videos?.results.find(v => v.type === "Trailer" && v.site === "YouTube");
  const year = tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : "";

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative w-full h-[60vh] max-h-[800px]">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent z-10" />
        {tv.backdrop_path && (
          <img 
            src={getImageUrl(tv.backdrop_path, "original")!} 
            alt={tv.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="container max-w-screen-2xl mx-auto px-4 -mt-40 md:-mt-64 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-8">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-border/50 bg-card hidden md:block">
              {tv.poster_path ? (
                <img src={getImageUrl(tv.poster_path)!} alt={tv.name} className="w-full h-auto" />
              ) : (
                <div className="w-full aspect-[2/3] flex items-center justify-center bg-muted">No Image</div>
              )}
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" /> Where to Watch
              </h3>
              <WatchProviders id={id!} type="tv" />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-9 pt-4 md:pt-16 lg:pt-32">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 text-white">
              {tv.name}
            </h1>
            
            {tv.tagline && (
              <p className="text-xl md:text-2xl text-muted-foreground italic mb-6">"{tv.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm font-medium mb-8">
              {tv.vote_average > 0 && (
                <span className="flex items-center gap-1.5 text-white bg-primary/20 text-primary px-2.5 py-1 rounded-md">
                  <Star className="w-4 h-4 fill-primary" />
                  {tv.vote_average.toFixed(1)}
                </span>
              )}
              {year && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-4 h-4" /> {year}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Layers className="w-4 h-4" /> {tv.number_of_seasons} Seasons
              </span>
              <span className="px-2 py-0.5 border border-border/50 rounded text-muted-foreground uppercase text-xs">
                {tv.status}
              </span>
              <div className="flex gap-2 ml-2">
                {tv.genres?.map((g: any) => (
                  <Badge key={g.id} variant="outline" className="bg-card text-foreground">{g.name}</Badge>
                ))}
              </div>
            </div>

            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-bold mb-4">Overview</h3>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">
                  {tv.overview}
                </p>
              </div>

              {credits?.cast && credits.cast.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">Top Cast</h3>
                  <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
                    {credits.cast.slice(0, 10).map((person) => (
                      <div key={person.id} className="min-w-[120px] snap-start">
                        <div className="aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-card border border-border/50">
                          {person.profile_path ? (
                            <img src={getImageUrl(person.profile_path)!} alt={person.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted text-xs text-muted-foreground">No Image</div>
                          )}
                        </div>
                        <h4 className="font-semibold text-sm line-clamp-1">{person.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{person.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {trailer && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">Trailer</h3>
                  <div className="aspect-video w-full max-w-4xl rounded-2xl overflow-hidden bg-card border border-border/50 shadow-xl">
                    <iframe 
                      src={`https://www.youtube.com/embed/${trailer.key}`}
                      title={trailer.name}
                      className="w-full h-full"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {similar?.results && similar.results.length > 0 && (
                <div className="pt-8 border-t border-border/50">
                  <h3 className="text-2xl font-bold mb-6">Similar Shows</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {similar.results.slice(0, 5).map((item) => (
                      <MediaCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}