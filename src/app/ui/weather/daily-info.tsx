import styles from "./daily-info.module.css";
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
        <div className={styles["info-container"]}>
            <div>{title}</div>            
            <div className={styles["temperature"]}>
                <span>{props.temperature.avg}</span>
                <span>
                    <TemperatureIndicator temperature={props.temperature} />
                </span>                
            </div>
        </div>
    </>)
}