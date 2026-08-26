import { useState } from "react";
import { POKEMON } from "../../data/pokemon";
import { REGIONS } from "../../data/regions";
import type { PokemonType } from "../../types/pokemon";
import { ScreenBezel } from "../../components/layout/ScreenBezel";
import { PokemonSprite } from "../../components/ui/PokemonSprite";
import { TYPE_COLORS } from "../../lib/typeColors";
import styles from "./MapPage.module.css";

interface RegionData {
  id: string;
  name: string;
  generation: number;
  pokemon: typeof POKEMON;
  typeCounts: Map<PokemonType, number>;
}

function buildRegionData(): RegionData[] {
  return REGIONS.map((r) => {
    const pokemon = POKEMON.filter((p) => p.regionId === r.id);
    const typeCounts = new Map<PokemonType, number>();
    for (const p of pokemon) {
      for (const t of p.types) {
        typeCounts.set(t, (typeCounts.get(t) ?? 0) + 1);
      }
    }
    return { ...r, pokemon, typeCounts };
  });
}

const REGION_DATA = buildRegionData();

export function MapPage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <ScreenBezel>
      <div className={styles.content}>
        <h2 className={styles.heading}>Region Map</h2>

        <div className={styles.regions}>
          {REGION_DATA.map((region) => {
            const isOpen = expanded.has(region.id);
            const sortedTypes = [...region.typeCounts.entries()].sort(
              (a, b) => b[1] - a[1]
            );

            return (
              <div key={region.id} className={styles.regionCard}>
                <button
                  className={styles.regionHeader}
                  onClick={() => toggle(region.id)}
                  aria-expanded={isOpen}
                >
                  <div className={styles.regionInfo}>
                    <span className={styles.regionName}>{region.name}</span>
                    <span className={styles.regionGen}>
                      Gen {region.generation}
                    </span>
                  </div>
                  <div className={styles.regionMeta}>
                    <span className={styles.pokemonCount}>
                      {region.pokemon.length} Pokémon
                    </span>
                    <span
                      className={`${styles.expandIcon} ${isOpen ? styles.expandIconOpen : ""}`}
                    >
                      ▶
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <>
                    <div className={styles.typeSummary}>
                      {sortedTypes.map(([type, count]) => (
                        <span
                          key={type}
                          className={styles.typeCount}
                          style={{ background: TYPE_COLORS[type].bg }}
                        >
                          {type} {count}
                        </span>
                      ))}
                    </div>
                    <div className={styles.pokemonGrid}>
                      {region.pokemon.map((p) => (
                        <div key={p.id} className={styles.pokemonCell}>
                          <PokemonSprite
                            src={p.spriteUrl}
                            alt={p.name}
                            size="sm"
                          />
                          <span className={styles.cellNumber}>
                            #{String(p.id).padStart(4, "0")}
                          </span>
                          <span className={styles.cellName}>{p.name}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ScreenBezel>
  );
}
