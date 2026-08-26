import { ScreenBezel } from "../../components/layout/ScreenBezel";
import { RegionMap } from "./RegionMap";
import styles from "./MapPage.module.css";

export function MapPage() {
  return (
    <ScreenBezel>
      <div className={styles.content}>
        <h2 className={styles.heading}>Region Map</h2>
        <RegionMap />
      </div>
    </ScreenBezel>
  );
}
