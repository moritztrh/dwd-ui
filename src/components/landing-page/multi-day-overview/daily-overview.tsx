import styles from "./daily-overview.module.css"
import { AirTemperatureResult } from "../../../lib/products/AirTemperature";
import { WeatherDescriptionResult } from "../../../lib/products/Description";
import { DailyProductResult } from "./data";
import TemperatureStats from "./temperature-stats";

export type DailyOverViewProps = {
    data: DailyProductResult;
    onDaySelect?: (date: Date) => void;
}

const DailyOverView = (props: DailyOverViewProps) => {
    let temperature = props.data.results.find(x => x instanceof AirTemperatureResult) as AirTemperatureResult;
    let description = props.data.results.find(x => x instanceof WeatherDescriptionResult) as WeatherDescriptionResult;
    let relevantCategories = description.categoryShares.filter(x => x.share > 0.25).map(x => x.category);

    return <>
        <div className={styles["daily-overview"]}>
            <div>{toShortDateString(props.data.date)}</div>
            <div>{relevantCategories.join(", ")}</div>
            <div>
                <TemperatureStats min={temperature.min}
                                  max={temperature.max}
                                  avg={temperature.avg}/>
            </div>            
        </div>
    </>
}

function toShortDateString(date: Date): string {
    let locale = date.toLocaleDateString();
    return locale.slice(0, locale.length - 4);
}

export default DailyOverView;