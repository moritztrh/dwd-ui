import styles from "./station-overview.module.css";
import { Station } from "../../lib/api-client"

export type StationOverviewProps = {
    station: Station;
    distance: number;
}

const StationOverview = (props: StationOverviewProps) => {
    return <div className={styles["station-overview"]}>
        <h1>{props.station.name}</h1>
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
                <span>{Math.round(props.distance / 1000 * 100)/100} km</span>
            </div>
        </div>
    </div>
};

export default StationOverview;