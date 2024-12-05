import styles from "./daily-overview.module.css"
import { AirTemperatureResult } from "../../../lib/products/AirTemperature";
import { WeatherDescriptionResult } from "../../../lib/products/Description";
import { DailyProductResult } from "./data";
import TemperatureStats from "./temperature-stats";
import { calculateSolarEvents } from "../../../lib/solar-events";
import { Coordinates, Station } from "../../../lib/api-types";

export type DailyOverViewProps = {
    coordinates: Coordinates;
    data: DailyProductResult;
    onDaySelect: (date: Date) => void;
}

const DailyOverView = (props: DailyOverViewProps) => {
    let temperature = props.data.results.find(x => x instanceof AirTemperatureResult) as AirTemperatureResult;
    let description = props.data.results.find(x => x instanceof WeatherDescriptionResult) as WeatherDescriptionResult;
    let relevantCategories = description.categoryShares.filter(x => x.share > 0.25).map(x => x.category);

    return <>
        <div className={styles["daily-overview"]}
             onClick={(_) => props.onDaySelect(props.data.date)}>
            <div>{getDateDescription(props.data.date)}</div>
            <div>{relevantCategories.join(", ")}</div>
            <div>
                <TemperatureStats min={temperature.min}
                                  max={temperature.max}
                                  avg={temperature.avg}/>
            </div>            
        </div>
    </>
}

const daysOfWeek: string[] = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag"
];

function getDateDescription(date: Date): string {
    if(date.getDate() === new Date().getDate()){
        return "Heute";
    }
    let dayOfWeek = daysOfWeek[date.getDay()].slice(0,2);
    let locale = date.toLocaleDateString();    
    let shortendLocal = locale.slice(0, locale.length - 4);
    return `${dayOfWeek} ${shortendLocal}`;
}

export default DailyOverView;