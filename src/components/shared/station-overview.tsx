import { Station } from "../../lib/api-types";
import DwdCard from "./dwd-card";
import styles from "./station-overview.module.css";

export type StationOverviewProps = {
    station: Station;
    distance: number;
}

const StationOverview = (props: StationOverviewProps) => {
    return (
        <DwdCard>
            <div className={styles["station-overview"]}>
                <div className={styles["station-name"]}>{props.station.name}</div>
                <div>
                    <div className={styles["coordinates"]}>
                        <div>
                            lon <span>{props.station.longitude}</span>
                        </div>
                        <div>
                            lat <span>{props.station.latitude}</span>
                        </div>
                    </div>
                    <div>
                        <span>{Math.round(props.distance / 1000 * 100) / 100} km</span>
                    </div>
                </div>
            </div>
        </DwdCard>
    )
};

export default StationOverview;