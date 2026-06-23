import { useQuery } from "@tanstack/react-query";
import { api, getImageUrl } from "@/lib/tmdb";
import { useCountry } from "@/hooks/useCountry";
import { Skeleton } from "@/components/ui/skeleton";

interface WatchProvidersProps {
  id: string;
  type: "movie" | "tv";
}

export function WatchProviders({ id, type }: WatchProvidersProps) {
  const { country } = useCountry();
  const { data, isLoading, error } = useQuery({
    queryKey: ["providers", type, id],
    queryFn: () => type === "movie" ? api.getMovieProviders(id) : api.getTVProviders(id)
  });

  if (isLoading) return <Skeleton className="h-32 w-full rounded-xl" />;
  if (error || !data) return null;

  const providers = data.results[country];

  if (!providers || (!providers.flatrate && !providers.rent && !providers.buy)) {
    return (
      <div className="p-6 text-center border border-border/50 rounded-xl bg-card">
        <p className="text-muted-foreground">No streaming providers available in your selected region.</p>
      </div>
    );
  }

  const renderProviderGroup = (title: string, items: any[] | undefined) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-6 last:mb-0">
        <h4 className="text-xs font-bold mb-3 text-muted-foreground uppercase tracking-wider">{title}</h4>
        <div className="flex flex-wrap gap-3">
          {items.map((p: any) => (
            <div key={p.provider_id} className="relative group cursor-pointer" title={p.provider_name}>
              <img 
                src={getImageUrl(p.logo_path, "w500")!} 
                alt={p.provider_name}
                className="w-14 h-14 rounded-xl object-cover shadow-sm transition-transform duration-200 group-hover:scale-110 ring-1 ring-border/50"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderProviderGroup("Stream", providers.flatrate)}
      {renderProviderGroup("Rent", providers.rent)}
      {renderProviderGroup("Buy", providers.buy)}
      {providers.link && (
        <div className="pt-2">
          <a href={providers.link} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline font-medium">
            View full details on TMDB →
          </a>
        </div>
      )}
    </div>
  );
}