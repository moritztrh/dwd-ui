import styles from "./temperature-stats.module.css";
import { AirTemperature } from "../../../lib/products/AirTemperature"

export type TemperatureStatsProps = {
    min?: AirTemperature;
    max?: AirTemperature;
    avg?: number;
}

const TemperatureStats = (props: TemperatureStatsProps) => {
    const max = props.max?.temperature ? `${props.max.temperature}°` : "-";
    const min = props.min?.temperature ? `${props.min.temperature}°` : "-";
    const avg = props.avg ? `${props.avg}°` : "-";

    return <>
        <div className={styles["temperature-stats"]}>
            <div className={styles["avg"]}>
                <span>Ø</span>
                <span>{avg}</span>
            </div>  
            <div className={styles["min-max"]}>
                <span>max</span>
                <span>{max}</span>
                <span>min</span>
                <span>{min}</span>   
            </div>                      
        </div>
    </>
}

export default TemperatureStats;