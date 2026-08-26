import { useState } from "react";
import { POKEMON } from "../../data/pokemon";
import { REGIONS } from "../../data/regions";
import { PokemonSprite } from "../../components/ui/PokemonSprite";
import { TypeBadge } from "../../components/ui/TypeBadge";
import styles from "./MapPage.module.css";

const BASE = import.meta.env.BASE_URL;

/**
 * Region map images from the games, positioned on a world map
 * based on their real-world inspirations.
 * x/y = center position (% of viewBox), w/h = display size in SVG units.
 */
const REGION_MAP_DATA: {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}[] = [
  // Japan cluster (right side)
  { id: "kanto", x: 74, y: 40, w: 16, h: 12, color: "#ef4444" },
  { id: "johto", x: 62, y: 42, w: 14, h: 10, color: "#f59e0b" },
  { id: "hoenn", x: 68, y: 56, w: 15, h: 11, color: "#22c55e" },
  { id: "sinnoh", x: 78, y: 24, w: 14, h: 11, color: "#3b82f6" },
  // Americas
  { id: "unova", x: 24, y: 34, w: 13, h: 14, color: "#8b5cf6" },
  { id: "alola", x: 14, y: 56, w: 11, h: 9, color: "#14b8a6" },
  // Europe
  { id: "kalos", x: 46, y: 30, w: 14, h: 12, color: "#ec4899" },
  { id: "galar", x: 42, y: 14, w: 9, h: 16, color: "#f97316" },
  { id: "paldea", x: 42, y: 50, w: 14, h: 11, color: "#a855f7" },
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
      {/* World map with region game maps */}
      <svg
        viewBox="0 0 100 75"
        className={styles.worldMap}
        role="img"
        aria-label="Pokémon region world map"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="shadow">
            <feDropShadow dx="0.3" dy="0.3" stdDeviation="0.5" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Ocean background */}
        <rect x="0" y="0" width="100" height="75" fill="var(--screen-bg)" rx="3" />

        {/* Grid lines for LCD effect */}
        {Array.from({ length: 15 }, (_, i) => (
          <line
            key={`h${i}`}
            x1="0" y1={i * 5} x2="100" y2={i * 5}
            stroke="var(--screen-border)" strokeWidth="0.1" opacity="0.2"
          />
        ))}
        {Array.from({ length: 20 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={i * 5} y1="0" x2={i * 5} y2="75"
            stroke="var(--screen-border)" strokeWidth="0.1" opacity="0.2"
          />
        ))}

        {/* Connecting routes */}
        <g stroke="var(--screen-text-secondary)" strokeWidth="0.2" strokeDasharray="1,1" opacity="0.3">
          <line x1="74" y1="40" x2="62" y2="42" />
          <line x1="68" y1="56" x2="74" y2="40" />
          <line x1="78" y1="24" x2="74" y2="40" />
          <line x1="42" y1="14" x2="46" y2="30" />
          <line x1="46" y1="30" x2="42" y2="50" />
          <line x1="24" y1="34" x2="42" y2="50" />
          <line x1="14" y1="56" x2="24" y2="34" />
        </g>

        {/* Region map images */}
        {REGION_MAP_DATA.map((rd) => {
          const region = REGIONS.find((r) => r.id === rd.id);
          if (!region) return null;
          const isSelected = selected === rd.id;
          const isHovered = hovered === rd.id;

          return (
            <g
              key={rd.id}
              onClick={() => setSelected(isSelected ? null : rd.id)}
              onMouseEnter={() => setHovered(rd.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
              role="button"
              aria-label={`${region.name} - Generation ${region.generation}`}
            >
              {/* Glow behind image when active */}
              {(isSelected || isHovered) && (
                <rect
                  x={rd.x - rd.w / 2 - 0.5}
                  y={rd.y - rd.h / 2 - 0.5}
                  width={rd.w + 1}
                  height={rd.h + 1}
                  rx="1.5"
                  fill="none"
                  stroke={rd.color}
                  strokeWidth={isSelected ? 0.8 : 0.5}
                  filter="url(#glow)"
                  opacity={isSelected ? 0.9 : 0.5}
                />
              )}

              {/* Region border */}
              <rect
                x={rd.x - rd.w / 2 - 0.3}
                y={rd.y - rd.h / 2 - 0.3}
                width={rd.w + 0.6}
                height={rd.h + 0.6}
                rx="1.2"
                fill={rd.color}
                opacity={isSelected ? 0.8 : 0.3}
              />

              {/* Game map image */}
              <image
                href={`${BASE}regions/${rd.id}.png`}
                x={rd.x - rd.w / 2}
                y={rd.y - rd.h / 2}
                width={rd.w}
                height={rd.h}
                preserveAspectRatio="xMidYMid meet"
                style={{
                  borderRadius: "1px",
                  opacity: isSelected ? 1 : isHovered ? 0.9 : 0.75,
                  transition: "opacity 0.15s",
                }}
                filter="url(#shadow)"
              />

              {/* Region label below image */}
              <text
                x={rd.x}
                y={rd.y + rd.h / 2 + 2.8}
                textAnchor="middle"
                fill={isSelected ? rd.color : "var(--screen-text)"}
                fontSize="2.5"
                fontFamily="var(--mono)"
                fontWeight={isSelected ? "bold" : "normal"}
                style={{ pointerEvents: "none" }}
              >
                {region.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Selected region detail panel */}
      {selectedRegion && (
        <div className={styles.regionDetail}>
          <div className={styles.detailHeader}>
            <div className={styles.detailTitleRow}>
              <img
                src={`${BASE}regions/${selected}.png`}
                alt={`${selectedRegion.name} map`}
                className={styles.detailMapThumb}
              />
              <div>
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
            </div>
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
