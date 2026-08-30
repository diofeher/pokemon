import { StatsProvider } from "./context/StatsContext";
import { DifficultyProvider } from "./context/DifficultyContext";
import { SpacedRepetitionProvider } from "./context/SpacedRepetitionContext";
import { useRoute } from "./routes/useRoute";
import { Header } from "./components/layout/Header";
import { QuizPage } from "./pages/QuizPage/QuizPage";
import { PokedexPage } from "./pages/PokedexPage/PokedexPage";
import { MapPage } from "./pages/MapPage/MapPage";
import styles from "./App.module.css";

function App() {
  const { path, navigate } = useRoute();

  return (
    <DifficultyProvider>
      <StatsProvider>
        <SpacedRepetitionProvider>
          <div className={styles.shell}>
            <Header currentRoute={path} onNavigate={navigate} />
            {path === "/" && <QuizPage />}
            {path === "/pokedex" && <PokedexPage />}
            {path === "/map" && <MapPage />}
            <div className={styles.bottomEdge} />
          </div>
        </SpacedRepetitionProvider>
      </StatsProvider>
    </DifficultyProvider>
  );
}

export default App;
