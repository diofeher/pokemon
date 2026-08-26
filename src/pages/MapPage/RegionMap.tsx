import { useState } from "react";
import { POKEMON } from "../../data/pokemon";
import { REGIONS } from "../../data/regions";
import { PokemonSprite } from "../../components/ui/PokemonSprite";
import { TypeBadge } from "../../components/ui/TypeBadge";
import styles from "./MapPage.module.css";

const BASE = import.meta.env.BASE_URL;

/**
 * Clickable region hotspots positioned over the world map image.
 * x/y = center of the region label (% of image dimensions),
 * matched to mossen1998's Pokemon World Map.
 */
const REGION_HOTSPOTS: {
  id: string;
  x: number;
  y: number;
  color: string;
}[] = [
  { id: "galar", x: 7, y: 33, color: "#f97316" },
  { id: "paldea", x: 19, y: 42, color: "#a855f7" },
  { id: "kalos", x: 35, y: 27, color: "#ec4899" },
  { id: "unova", x: 36, y: 56, color: "#8b5cf6" },
  { id: "johto", x: 49, y: 40, color: "#f59e0b" },
  { id: "sinnoh", x: 66, y: 12, color: "#3b82f6" },
  { id: "kanto", x: 64, y: 40, color: "#ef4444" },
  { id: "hoenn", x: 60, y: 58, color: "#22c55e" },
  { id: "alola", x: 91, y: 25, color: "#14b8a6" },
];

export function RegionMap() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedRegion = REGIONS.find((r) => r.id === selected);
  const selectedPokemon = selected
    ? POKEMON.filter((p) => p.regionId === selected)
    : [];

  return (
    <div className={styles.mapContainer}>
      {/* World map with clickable hotspots */}
      <div className={styles.mapWrapper}>
        <img
          src={`${BASE}pokemon-world-map.jpg`}
          alt="Pokémon World Map"
          className={styles.mapImage}
          draggable={false}
        />

        {/* Region hotspot buttons */}
        {REGION_HOTSPOTS.map((hs) => {
          const region = REGIONS.find((r) => r.id === hs.id);
          if (!region) return null;
          const isSelected = selected === hs.id;

          return (
            <button
              key={hs.id}
              className={`${styles.hotspot} ${isSelected ? styles.hotspotActive : ""}`}
              style={{
                left: `${hs.x}%`,
                top: `${hs.y}%`,
                "--region-color": hs.color,
              } as React.CSSProperties}
              onClick={() => setSelected(isSelected ? null : hs.id)}
              aria-label={`${region.name} - Generation ${region.generation}`}
            >
              {region.name}
            </button>
          );
        })}
      </div>

      {/* Selected region detail panel */}
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
