import { useState } from "react";
import { POKEMON } from "../../data/pokemon";
import { REGIONS } from "../../data/regions";
import { PokemonSprite } from "../../components/ui/PokemonSprite";
import { TypeBadge } from "../../components/ui/TypeBadge";
import styles from "./MapPage.module.css";

/**
 * Each region positioned roughly on a world map based on real-world inspiration:
 * Kanto/Johto/Hoenn/Sinnoh → Japan, Unova → NYC, Kalos → France,
 * Alola → Hawaii, Galar → UK, Paldea → Spain
 *
 * Coordinates are percentages of the SVG viewBox (0-100).
 */
const REGION_POSITIONS: {
  id: string;
  x: number;
  y: number;
  path: string;
  color: string;
  labelOffset?: { dx: number; dy: number };
}[] = [
  {
    id: "kanto",
    x: 78,
    y: 42,
    path: "M-7,-5 L0,-8 L8,-4 L9,2 L4,7 L-3,6 L-8,1 Z",
    color: "#ef4444",
  },
  {
    id: "johto",
    x: 73,
    y: 44,
    path: "M-6,-5 L1,-7 L7,-3 L6,3 L1,7 L-5,5 L-8,-1 Z",
    color: "#f59e0b",
  },
  {
    id: "hoenn",
    x: 76,
    y: 52,
    path: "M-7,-4 L0,-7 L8,-3 L7,3 L1,7 L-6,5 L-8,0 Z",
    color: "#22c55e",
  },
  {
    id: "sinnoh",
    x: 80,
    y: 32,
    path: "M-5,-7 L3,-8 L8,-3 L7,4 L1,8 L-6,5 L-8,-1 Z",
    color: "#3b82f6",
  },
  {
    id: "unova",
    x: 28,
    y: 38,
    path: "M-4,-8 L4,-7 L8,-2 L6,5 L0,8 L-6,4 L-7,-2 Z",
    color: "#8b5cf6",
  },
  {
    id: "kalos",
    x: 48,
    y: 35,
    path: "M-6,-6 L2,-8 L8,-3 L7,4 L0,8 L-7,4 L-8,-1 Z",
    color: "#ec4899",
  },
  {
    id: "alola",
    x: 18,
    y: 55,
    path: "M-4,-4 L2,-5 L5,-2 L4,3 L-1,5 L-5,2 Z",
    color: "#14b8a6",
  },
  {
    id: "galar",
    x: 45,
    y: 25,
    path: "M-3,-8 L3,-7 L5,-1 L4,5 L0,8 L-4,5 L-5,-1 Z",
    color: "#f97316",
  },
  {
    id: "paldea",
    x: 44,
    y: 45,
    path: "M-6,-6 L1,-8 L7,-4 L8,2 L3,7 L-4,6 L-8,0 Z",
    color: "#a855f7",
  },
];

export function RegionMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const selectedRegion = REGIONS.find((r) => r.id === selected);
  const selectedPokemon = selected
    ? POKEMON.filter((p) => p.regionId === selected)
    : [];

  return (
    <div className={styles.mapContainer}>
      <svg
        viewBox="0 0 100 75"
        className={styles.worldMap}
        role="img"
        aria-label="Pokémon region world map"
      >
        {/* Ocean background */}
        <rect x="0" y="0" width="100" height="75" fill="var(--screen-bg)" rx="4" />

        {/* Grid lines for LCD effect */}
        {Array.from({ length: 15 }, (_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={i * 5}
            x2="100"
            y2={i * 5}
            stroke="var(--screen-border)"
            strokeWidth="0.15"
            opacity="0.3"
          />
        ))}
        {Array.from({ length: 20 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={i * 5}
            y1="0"
            x2={i * 5}
            y2="75"
            stroke="var(--screen-border)"
            strokeWidth="0.15"
            opacity="0.3"
          />
        ))}

        {/* Connecting routes between regions */}
        <g stroke="var(--screen-border)" strokeWidth="0.3" strokeDasharray="1,1" opacity="0.4">
          {/* Japan cluster */}
          <line x1="78" y1="42" x2="73" y2="44" />
          <line x1="76" y1="52" x2="78" y2="42" />
          <line x1="80" y1="32" x2="78" y2="42" />
          {/* Europe cluster */}
          <line x1="45" y1="25" x2="48" y2="35" />
          <line x1="48" y1="35" x2="44" y2="45" />
          {/* Cross-ocean */}
          <line x1="28" y1="38" x2="44" y2="45" />
          <line x1="18" y1="55" x2="28" y2="38" />
        </g>

        {/* Region shapes */}
        {REGION_POSITIONS.map((rp) => {
          const region = REGIONS.find((r) => r.id === rp.id);
          if (!region) return null;
          const isSelected = selected === rp.id;
          const isHovered = hovered === rp.id;
          const scale = isSelected ? 1.15 : isHovered ? 1.08 : 1;

          return (
            <g
              key={rp.id}
              transform={`translate(${rp.x}, ${rp.y}) scale(${scale})`}
              onClick={() => setSelected(isSelected ? null : rp.id)}
              onMouseEnter={() => setHovered(rp.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
              role="button"
              aria-label={`${region.name} - Generation ${region.generation}`}
            >
              <path
                d={rp.path}
                fill={rp.color}
                fillOpacity={isSelected ? 0.9 : isHovered ? 0.7 : 0.5}
                stroke={isSelected ? "#fff" : rp.color}
                strokeWidth={isSelected ? 0.6 : 0.3}
              />
              {/* Glow effect */}
              {(isSelected || isHovered) && (
                <path
                  d={rp.path}
                  fill="none"
                  stroke={rp.color}
                  strokeWidth="1.5"
                  opacity="0.3"
                  filter="url(#glow)"
                />
              )}
              <text
                y={12}
                textAnchor="middle"
                fill="var(--screen-text)"
                fontSize="2.8"
                fontFamily="var(--mono)"
                style={{ pointerEvents: "none" }}
              >
                {region.name}
              </text>
              <text
                y={15}
                textAnchor="middle"
                fill="var(--screen-text-secondary)"
                fontSize="2"
                fontFamily="var(--mono)"
                style={{ pointerEvents: "none" }}
              >
                Gen {region.generation}
              </text>
            </g>
          );
        })}

        {/* Glow filter */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

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
