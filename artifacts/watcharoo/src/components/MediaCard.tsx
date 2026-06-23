import { Link } from "wouter";
import { getImageUrl, MediaItem } from "@/lib/tmdb";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function MediaCard({ item }: { item: MediaItem }) {
  const isMovie = item.media_type === "movie" || item.title !== undefined;
  const href = `/${isMovie ? "movie" : "tv"}/${item.id}`;
  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date;
  const year = date ? new Date(date).getFullYear() : "";

  return (
    <Link href={href} className="group relative block w-full" data-testid={`link-media-${item.id}`}>
      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }} className="space-y-2">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-card border border-border/50">
          {item.poster_path ? (
            <img 
              src={getImageUrl(item.poster_path)} 
              alt={title} 
              className="object-cover w-full h-full transition-all duration-300 group-hover:brightness-75"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm">No Image</div>
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur border-border text-xs font-medium">
              {isMovie ? "Movie" : "TV"}
            </Badge>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
            <span>{year}</span>
            {item.vote_average ? (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-primary fill-primary" />
                {item.vote_average.toFixed(1)}
              </span>
            ) : null}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}