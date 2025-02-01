import styles from "./daily-overview.module.css"
import { AirTemperatureResult } from "../../../lib/products/AirTemperature";
import { WeatherDescriptionResult } from "../../../lib/products/Description";
import { DailyProductResult } from "./data";
import TemperatureStats from "./temperature-stats";
import { Coordinates } from "../../../lib/api-types";
import DwdWeatherCategoryIcon, { WeatherIconSize } from "../../shared/dwd-weather-category-icon";
import DwdCard from "../../shared/dwd-card";

export type DailyOverViewProps = {
    coordinates: Coordinates;
    data: DailyProductResult;    
}

const DailyOverView = (props: DailyOverViewProps) => {
    const temperature = props.data.results.find(x => x instanceof AirTemperatureResult) as AirTemperatureResult;
    const description = props.data.results.find(x => x instanceof WeatherDescriptionResult) as WeatherDescriptionResult;    
    const relevantCategories = description.categoryShares.filter(x => x.share > 0.25).map(x => x.category);
    const detailsUrl = getDetailsUrl(props.coordinates, props.data.date);

    return <>
        <DwdCard href={detailsUrl}>
            <div className={styles["daily-overview"]}>
                <div>{getDateDescription(props.data.date)}</div>
                <div className={styles["category-icons"]}>{relevantCategories.map(c => <DwdWeatherCategoryIcon size={WeatherIconSize.Small} category={c}/>)}</div>            
                <div>                
                    <TemperatureStats min={temperature.min}
                                    max={temperature.max}
                                    avg={temperature.avg}/>
                </div>            
            </div>
        </DwdCard>
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

function getDetailsUrl(coords: Coordinates, date: Date): string {
    return `/details?lon=${coords.longitude}&lat=${coords.latitude}&date=${date.toISOString()}`
}

export default DailyOverView;