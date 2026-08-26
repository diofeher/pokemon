import { useState } from "react";
import { POKEMON } from "../../data/pokemon";
import { REGIONS } from "../../data/regions";
import { PokemonSprite } from "../../components/ui/PokemonSprite";
import { TypeBadge } from "../../components/ui/TypeBadge";
import styles from "./MapPage.module.css";

const BASE = import.meta.env.BASE_URL;

/**
 * Invisible clickable hotspots aligned over the region labels
 * on mossen1998's Pokemon World Map (1091×733).
 * x/y = center of the ALL-CAPS label on the map (% of image).
 * w/h = hotspot size covering the region area (% of image).
 */
const REGION_HOTSPOTS: {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}[] = [
  { id: "galar", x: 6, y: 35, w: 10, h: 7, color: "#f97316" },
  { id: "paldea", x: 25, y: 40, w: 10, h: 7, color: "#a855f7" },
  { id: "kalos", x: 35, y: 30, w: 10, h: 7, color: "#ec4899" },
  { id: "unova", x: 37, y: 55, w: 10, h: 7, color: "#8b5cf6" },
  { id: "johto", x: 50, y: 43, w: 10, h: 7, color: "#f59e0b" },
  { id: "sinnoh", x: 72, y: 19, w: 14, h: 7, color: "#3b82f6" },
  { id: "kanto", x: 69, y: 43, w: 10, h: 7, color: "#ef4444" },
  { id: "hoenn", x: 62, y: 53, w: 10, h: 7, color: "#22c55e" },
  { id: "alola", x: 85, y: 37, w: 10, h: 7, color: "#14b8a6" },
];

export function RegionMap() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedRegion = REGIONS.find((r) => r.id === selected);
  const selectedPokemon = selected
    ? POKEMON.filter((p) => p.regionId === selected)
    : [];

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapWrapper}>
        <img
          src={`${BASE}pokemon-world-map.jpg`}
          alt="Pokémon World Map"
          className={styles.mapImage}
          draggable={false}
        />

        {REGION_HOTSPOTS.map((hs) => {
          const region = REGIONS.find((r) => r.id === hs.id);
          if (!region) return null;
          const isSelected = selected === hs.id;

          return (
            <button
              key={hs.id}
              className={`${styles.hotspot} ${isSelected ? styles.hotspotActive : ""}`}
              style={{
                left: `${hs.x - hs.w / 2}%`,
                top: `${hs.y - hs.h / 2}%`,
                width: `${hs.w}%`,
                height: `${hs.h}%`,
                "--region-color": hs.color,
              } as React.CSSProperties}
              onClick={() => setSelected(isSelected ? null : hs.id)}
              aria-label={`${region.name} - Generation ${region.generation}`}
            />
          );
        })}
      </div>

      {selectedRegion && (
        <div className={styles.regionDetail}>
          <div className={styles.detailHeader}>
            <h3 className={styles.detailTitle}>
              {selectedRegion.name}
              <span className={styles.detailGen}>
                Gen {selectedRegion.generation}
              </span>
            </h3>
            <span className={styles.detailCount}>
              {selectedPokemon.length} Pokémon
            </span>
          </div>
          <div className={styles.detailGrid}>
            {selectedPokemon.map((p) => (
              <div key={p.id} className={styles.detailCell}>
                <PokemonSprite src={p.spriteUrl} alt={p.name} size="sm" />
                <span className={styles.cellNumber}>
                  #{String(p.id).padStart(4, "0")}
                </span>
                <span className={styles.cellName}>{p.name}</span>
                <div className={styles.cellTypes}>
                  {p.types.map((t) => (
                    <TypeBadge key={t} type={t} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
