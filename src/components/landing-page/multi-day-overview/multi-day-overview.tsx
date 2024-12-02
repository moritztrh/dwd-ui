import styles from "./multi-day-overview.module.css";
import DailyOverView from "./daily-overview";
import { groupByDay } from "./data";
import { WeatherData } from "../../../lib/api-types";

export type MultiDayOverviewProps = {
    data: WeatherData;
    onDaySelect: (date: Date) => void
}

const MultiDayOverview = (props: MultiDayOverviewProps) => {    
    const dailyData = groupByDay(props.data);
    return <>
        <div className={styles["multi-day-overview"]}>
            {dailyData.results.map(x => <DailyOverView key={x.date.toISOString()} 
                                                       data={x}
                                                       onDaySelect={props.onDaySelect}/>)}
        </div>
    </>
}

export default MultiDayOverview;