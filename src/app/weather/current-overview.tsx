import styles from "./current-overview.module.css"
import { DailyProductValue, Station } from "./data"

export type CurrentOverviewProps = {
    station: Station
    temperature: DailyProductValue;
}


export default function CurrentOverview(props: CurrentOverviewProps){
    
    let currentHour = new Date().getHours()
    let currentTemperature = props.temperature.values.filter(x => x.time.getHours() == currentHour)[0];
        
    return (
    <div className={styles["current-overview"]}>
        <div className={styles["station-name"]}>{props.station.name}</div>
        <div className={styles["current-temperature"]}>{currentTemperature.value}°</div>
    </div>)
}