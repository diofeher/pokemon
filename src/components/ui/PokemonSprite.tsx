import { useState } from "react";
import styles from "./PokemonSprite.module.css";

const FALLBACK_POKEBALL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%23333' stroke='%23555' stroke-width='3'/%3E%3Crect x='2' y='47' width='96' height='6' fill='%23555'/%3E%3Ccircle cx='50' cy='50' r='12' fill='%23444' stroke='%23555' stroke-width='3'/%3E%3Ccircle cx='50' cy='50' r='6' fill='%23666'/%3E%3C/svg%3E";

interface PokemonSpriteProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  silhouette?: boolean;
}

export function PokemonSprite({
  src,
  alt,
  size = "lg",
  silhouette = false,
}: PokemonSpriteProps) {
  const [error, setError] = useState(false);
  // Track which src has loaded — avoids useEffect timing gap
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  const actualSrc = error ? FALLBACK_POKEBALL : src;
  const isLoaded = loadedSrc === actualSrc;

  // Reset error when src changes (synchronous check, no useEffect delay)
  if (error && loadedSrc !== null && loadedSrc !== src) {
    setError(false);
  }

  // Hide until loaded in silhouette mode — prevents any flash of the real image
  const hideUntilLoaded = silhouette && !isLoaded;

  return (
    <img
      src={actualSrc}
      alt={silhouette ? "???" : alt}
      loading="lazy"
      className={`${styles.sprite} ${styles[size]} ${silhouette ? styles.silhouette : styles.revealed}`}
      style={hideUntilLoaded ? { visibility: "hidden" } : undefined}
      onLoad={() => setLoadedSrc(actualSrc)}
      onError={() => {
        setError(true);
        setLoadedSrc(null);
      }}
    />
  );
}
