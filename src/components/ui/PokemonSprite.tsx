import { useState, useEffect } from "react";
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
  const [loaded, setLoaded] = useState(false);

  // Reset error + loaded state when src changes (new question)
  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [src]);

  // Hide image until loaded when in silhouette mode to prevent flash
  const hideUntilLoaded = silhouette && !loaded && !error;

  return (
    <img
      src={error ? FALLBACK_POKEBALL : src}
      alt={silhouette ? "???" : alt}
      loading="lazy"
      className={`${styles.sprite} ${styles[size]} ${silhouette ? styles.silhouette : styles.revealed}`}
      style={hideUntilLoaded ? { visibility: "hidden" } : undefined}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
    />
  );
}
