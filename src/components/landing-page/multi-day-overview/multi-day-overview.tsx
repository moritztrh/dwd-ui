import styles from "./multi-day-overview.module.css";
import DailyOverView from "./daily-overview";
import { groupByDay } from "./data";
import { Coordinates, WeatherData } from "../../../lib/api-types";

export type MultiDayOverviewProps = {
    data: WeatherData;
    onDaySelect: (date: Date) => void
}

const MultiDayOverview = (props: MultiDayOverviewProps) => {    
    const coordinates: Coordinates = {latitude: props.data.station.latitude, longitude: props.data.station.longitude};
    const dailyData = groupByDay(props.data);
    return <>
        <div className={styles["multi-day-overview"]}>
            {dailyData.results.map(x => <DailyOverView key={x.date.toISOString()} 
                                                       coordinates={coordinates}
                                                       data={x}
                                                       onDaySelect={props.onDaySelect}/>)}
        </div>
    </>
}

export default MultiDayOverview;