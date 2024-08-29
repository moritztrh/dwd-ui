import { DailyProductValue } from "../data";
import styles from "./daily-overview.module.css";
import TemperatureIndicator from "./temperature-indicator";

export type DailyInfoProps = {
    date: Date;
    temperature: DailyProductValue;
}

const daysOfWeek: string[] = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag"
]

export default function DailyInfo(props: DailyInfoProps) {    
    
    let title: string;
    if(props.date.getDate() == new Date().getDate()){
        title = "Heute"
    } else {
        title = daysOfWeek[props.date.getDay()] ?? props.date.toLocaleDateString();                            
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