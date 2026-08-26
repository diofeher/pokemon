import { useState, useMemo } from "react";
import { POKEMON } from "../../data/pokemon";
import type { PokemonType } from "../../types/pokemon";
import { ScreenBezel } from "../../components/layout/ScreenBezel";
import { PokemonSprite } from "../../components/ui/PokemonSprite";
import { TypeBadge } from "../../components/ui/TypeBadge";
import { capitalize } from "../../lib/format";
import { getRegionName } from "../../data/regions";
import styles from "./PokedexPage.module.css";

const ALL_TYPES: PokemonType[] = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

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

          <p className={styles.count}>
            {filtered.length} Pokémon
          </p>

          <div className={styles.grid}>
            {filtered.slice(0, 100).map((p) => (
              <div key={p.id} className={styles.card}>
                <PokemonSprite
                  src={p.spriteUrl}
                  alt={p.name}
                  size="md"
                />
                <span className={styles.dexNumber}>#{String(p.id).padStart(4, "0")}</span>
                <span className={styles.pokemonName}>{p.name}</span>
                <div className={styles.types}>
                  {p.types.map((t) => (
                    <TypeBadge key={t} type={t} />
                  ))}
                </div>
                <span className={styles.region}>{getRegionName(p.regionId)}</span>
              </div>
            ))}
          </div>

          {filtered.length > 100 && (
            <p className={styles.more}>
              Showing 100 of {filtered.length} — use search to narrow down
            </p>
          )}
      </div>
    </ScreenBezel>
  );
}
