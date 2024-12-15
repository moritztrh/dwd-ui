import styles from './dwd-weather-visualizer.module.css'
import { PropsWithChildren } from "react";
import { WeatherCategory } from "../../lib/products/Description";
import { SolarEvents } from '../../lib/solar-events';

type DwdWeatherVisualizerProps = {
    categories: WeatherCategory[]
    solarEvents?: SolarEvents
}

enum PartOfDay {
    Day,
    Night,
    Twilight
}

const DwdWeatherVisualizer = (props: PropsWithChildren<DwdWeatherVisualizerProps>) => {

    const classes = ["weather-visualizer"];
    props.categories?.forEach(x => {
        classes.push(WeatherCategory[x].toLowerCase()+"-bg")
    });  
    
    let partOfDay = GetPartOfDay(new Date(), props.solarEvents)
    let partOfDayClass = PartOfDay[partOfDay].toLocaleLowerCase() + "-time";
    return (
        <div className={classes.map(x => styles[x]).join(' ')}>            
            <div className={styles[partOfDayClass]}>                
                {props.children}
            </div>                        
        </div>
    )
}

function GetPartOfDay(now: Date, solarEvents?: SolarEvents): PartOfDay {    
    if(!solarEvents) return PartOfDay.Day;
    if(solarEvents.dawn < now && now < solarEvents.dusk) return PartOfDay.Day;  
    if(solarEvents.sunrise < now && now < solarEvents.dawn) return PartOfDay.Twilight;
    if(solarEvents.dusk < now && now < solarEvents.sunset) return PartOfDay.Twilight;
    return PartOfDay.Night;
}

export default DwdWeatherVisualizer;