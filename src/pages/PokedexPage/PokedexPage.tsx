import { useState, useMemo } from "react";
import { POKEMON } from "../../data/pokemon";
import type { PokemonType } from "../../types/pokemon";
import { ScreenBezel } from "../../components/layout/ScreenBezel";
import { PokemonSprite } from "../../components/ui/PokemonSprite";
import { TypeBadge } from "../../components/ui/TypeBadge";
import { capitalize } from "../../lib/format";
import { getRegionName } from "../../data/regions";
import { useVirtualGrid } from "../../hooks/useVirtualGrid";
import styles from "./PokedexPage.module.css";

const ALL_TYPES: PokemonType[] = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

const ROW_HEIGHT = 170;
const GRID_GAP = 8;
const MIN_COL_WIDTH = 120;

export function PokedexPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<PokemonType | "">("");

  const filtered = useMemo(() => {
    let result = POKEMON;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          String(p.id).includes(q)
      );
    }

    if (typeFilter) {
      result = result.filter((p) => p.types.includes(typeFilter));
    }

    return result;
  }, [search, typeFilter]);

  const {
    containerRef,
    scrollRef,
    visibleRange,
    totalHeight,
    offsetY,
    columns,
  } = useVirtualGrid({
    totalItems: filtered.length,
    rowHeight: ROW_HEIGHT,
    gap: GRID_GAP,
    minColumnWidth: MIN_COL_WIDTH,
  });

  const visibleItems = filtered.slice(visibleRange.start, visibleRange.end);

  return (
    <ScreenBezel>
      <div className={styles.content}>
        <div className={styles.filters}>
          <input
            className={styles.search}
            type="text"
            placeholder="Search by name or #..."
            aria-label="Search Pokémon by name or number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className={styles.typeSelect}
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as PokemonType | "")
            }
          >
            <option value="">All types</option>
            {ALL_TYPES.map((t) => (
              <option key={t} value={t}>
                {capitalize(t)}
              </option>
            ))}
          </select>
        </div>

        <p className={styles.count}>{filtered.length} Pokémon</p>

        <div ref={scrollRef} className={styles.scrollContainer}>
          <div style={{ height: totalHeight, position: "relative" }}>
            <div
              ref={containerRef}
              className={styles.grid}
              style={{
                position: "absolute",
                top: offsetY,
                left: 0,
                right: 0,
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
              }}
            >
              {visibleItems.map((p) => (
                <div key={p.id} className={styles.card}>
                  <PokemonSprite
                    src={p.spriteUrl}
                    alt={p.name}
                    size="md"
                  />
                  <span className={styles.dexNumber}>
                    #{String(p.id).padStart(4, "0")}
                  </span>
                  <span className={styles.pokemonName}>{p.name}</span>
                  <div className={styles.types}>
                    {p.types.map((t) => (
                      <TypeBadge key={t} type={t} />
                    ))}
                  </div>
                  <span className={styles.region}>
                    {getRegionName(p.regionId)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScreenBezel>
  );
}
