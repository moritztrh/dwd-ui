import styles from "./temperature-indicator.module.css";
import { Color } from "@/app/lib/components/color-gradient/color";
import { DailyProductValue } from "../data";
import { ColorGradientCreator } from "@/app/lib/components/color-gradient/ColorGradientCreator";

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
            <div className={styles["temperature-indicator"]} style={{background: GetGradientForDay(props.temperature)}}>              
                    {props.temperature.values.map(x => {
                        let classNames = [
                            styles["hour-indicator"]
                        ];
                        if(x.time == props.temperature.min.time){
                            classNames.push(styles["min-temperature"])
                        }
                        if(x.time == props.temperature.max.time){
                            classNames.push(styles["max-temperature"])
                        }
                        return (
                            <div key={x.time.toISOString()} 
                                 className={classNames.join(" ")}>
                                    <div className={styles["time-info"]}>
                                        {x.time.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
                                    </div>                                
                                    <div className={styles["temperature-info"]}>
                                        {x.value}°
                                    </div>                                
                            </div>
                        )
                    })}                      
            </div>
        </>
    )    
}

function GetGradientForDay(daily: DailyProductValue): string {
    const max: number = 24;
    let colors: string[] = daily.values.map((x, idx) => {
        let step = x.value/max;        
        let color = gradient.getColorOnGradient(step);
        let gStop = (idx/23)*100;
        return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha}) ${gStop}%`
    });
    var result = `linear-gradient(90deg, ${colors.join(", ")})`;
    return result;
}