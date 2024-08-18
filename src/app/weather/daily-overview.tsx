import styles from "./daily-overview.module.css";
import TemperatureIndicator from "./temperature-indicator";
import { DailyProductValue } from "./data";

export type DailyInfoProps = {
    date: Date;
    temperature: DailyProductValue;
}

export default function DailyInfo(props: DailyInfoProps) {    
    
    let title = props.date.toLocaleDateString();
    if(title == new Date().toLocaleDateString()){
        title = "Today"
    }

    return (
    <>
        <div className={styles["daily-info"]}>
            <div className={styles["title"]}>{title}</div>            
            <div className={styles["temperature"]}>
                <div className={styles["average-temperature"]}>
                    {props.temperature.avg}° ⌀
                </div>
                <div>
                    <TemperatureIndicator temperature={props.temperature} />
                </div>            
            </div>
        </div>
    </>)
}