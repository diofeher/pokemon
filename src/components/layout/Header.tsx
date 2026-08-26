import { useStatsContext } from "../../context/StatsContext";
import type { AppRoute } from "../../routes/useRoute";
import styles from "./Header.module.css";

interface HeaderProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

export function Header({ currentRoute, onNavigate }: HeaderProps) {
  const { stats } = useStatsContext();

  const bestCurrentStreak = Math.max(
    ...Object.values(stats.modes).flatMap((diffModes) =>
      Object.values(diffModes).map((m) => m.currentStreak)
    ),
    0
  );

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.lights}>
          <span className={styles.lens} />
          <span className={`${styles.led} ${styles.red}`} />
          <span className={`${styles.led} ${styles.yellow}`} />
          <span className={`${styles.led} ${styles.green}`} />
        </div>
        <div className={styles.stats}>
          {bestCurrentStreak > 0 && (
            <span className={styles.streak} title="Current best streak">
              🔥 {bestCurrentStreak}
            </span>
          )}
          {stats.totalGames > 0 && (
            <span className={styles.games} title="Total games played">
              🎮 {stats.totalGames}
            </span>
          )}
        </div>
      </div>

      <div className={styles.brand}>
        <h1 className={styles.title}>POKÉDEX</h1>
      </div>

      <nav className={styles.nav}>
        <button
          className={`${styles.navButton} ${currentRoute === "/" ? styles.active : ""}`}
          aria-current={currentRoute === "/" ? "page" : undefined}
          onClick={() => onNavigate("/")}
        >
          🏆 Quiz
        </button>
        <button
          className={`${styles.navButton} ${currentRoute === "/pokedex" ? styles.active : ""}`}
          aria-current={currentRoute === "/pokedex" ? "page" : undefined}
          onClick={() => onNavigate("/pokedex")}
        >
          📖 Pokédex
        </button>
      </nav>
    </header>
  );
}
