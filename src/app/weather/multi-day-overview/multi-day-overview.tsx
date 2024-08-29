'use client'

import { DailyWeatherStationData } from "../data";
import styles from "./multi-day-overview.module.css";
import DailyOverview from "./daily-overview";

export type MultiDayOverviewProps = {
    data: DailyWeatherStationData
    onDaySelect?: ((date: Date) => void)
}

export default function MultiDayOverview(props: MultiDayOverviewProps) {    
    return (
    <div>                  
        <div className={styles["weather-forecast"]}>
            <div className={styles["heading"]}>10-Tage-Vorhersage</div>
            {props.data.results[0].values.map(x => {
                return (
                    <div className={styles["daily-wrapper"]} 
                         key={x.date.toISOString()} 
                         onClick={() => props.onDaySelect!(x.date)}>
                        <DailyOverview date={x.date} temperature={x} />    
                    </div>                    
                )
            })}
        </div>
    </div>)
} 