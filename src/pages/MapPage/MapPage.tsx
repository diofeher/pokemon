import { ScreenBezel } from "../../components/layout/ScreenBezel";
import { RegionMap } from "./RegionMap";
import styles from "./MapPage.module.css";

export function MapPage() {
  return (
    <ScreenBezel>
      <div className={styles.content}>
        <RegionMap />
      </div>
    </ScreenBezel>
  );
}
