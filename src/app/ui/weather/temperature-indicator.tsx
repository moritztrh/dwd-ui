import styles from "./temperature-indicator.module.css";
import { DailyProductValue } from "./data";
import { TimeSeriesValue } from "@/app/lib/types/time-series";
import { Color } from "../shared/color-gradient/color";
import { ColorGradientCreator } from "../shared/color-gradient/ColorGradientCreator";

export type TemperatureIndicatorProps = {
    temperature: DailyProductValue
}
    
const colors: Record<number, Color> = {}
colors[0] = { red: 0, green: 70, blue: 115, alpha: 1}
colors[0.1] = { red: 50, green: 150, blue: 220, alpha: 1}
colors[0.5] = { red: 45, green: 205, blue: 115, alpha: 1}
colors[0.85] = { red: 240, green: 200, blue: 15, alpha: 1}
colors[1] = { red: 195, green: 55, blue: 45, alpha: 1}

let gradient = new ColorGradientCreator(colors[0], colors[1])
gradient.setColor(0.15, colors[0.1])
gradient.setColor(0.5, colors[0.5]) 
gradient.setColor(0.85, colors[0.85])  

export default function TemperatureIndicator(props: TemperatureIndicatorProps) {        
        
    return (
        <>
            <div className={styles["container"]}>              
                <div className={styles["indicators"]}>                    
                    {props.temperature.values.map(x => {
                        return (
                        <div key={x.time.toISOString()}  className={styles["indicator"]}>
                            <div className={styles["hour"]}>{x.time.getHours()}</div>
                            <div className={styles["color-indicator"]} style={{background: GetColorStyle(x.value)}} />
                            <div className={styles[GetTemperatureClassName(x, props.temperature.min, props.temperature.max)]}>{x.value}°</div>
                        </div>)
                    })}
                </div>              
            </div>
        </>
    )    
}

function GetColorStyle(temperature: number): string {           
    const max: number = 30;
    let step = temperature / max;
    let clamped = Math.min(Math.max(step, 0), 1);    
    let color = gradient.getColorOnGradient(clamped);
    return `rgb(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
}

function GetTemperatureClassName(value: TimeSeriesValue, min: TimeSeriesValue, max: TimeSeriesValue): string {    
    if(value.time == min.time) return "min-temperature";
    if(value.time == max.time) return "max-temperature";
    return "temperature";
}