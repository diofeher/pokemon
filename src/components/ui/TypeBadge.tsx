import type { PokemonType } from "../../types/pokemon";
import { TYPE_COLORS } from "../../lib/typeColors";
import styles from "./TypeBadge.module.css";

interface TypeBadgeProps {
  type: PokemonType;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const { bg, text } = TYPE_COLORS[type];
  return (
    <span className={styles.badge} style={{ background: bg, color: text }}>
      {type}
    </span>
  );
}
