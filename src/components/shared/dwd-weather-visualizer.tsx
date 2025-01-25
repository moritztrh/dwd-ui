import styles from './dwd-weather-visualizer.module.css'
import { PropsWithChildren } from "react";
import { WeatherCategory } from "../../lib/products/Description";
import { SolarEvents } from '../../lib/solar-events';
import classNames from 'classnames';
import DwdFogVisual from './dwd-fog-visual';
import DwdRainVisual from './dwd-rain-visual';

export type DwdWeatherVisualizerProps = {
    referenceTime: Date,
    categories: WeatherCategory[]    
    solarEvents?: SolarEvents | null
}

enum PartOfDay {
    Day,
    Night,
    Twilight
}

const DwdWeatherVisualizer = (props: PropsWithChildren<DwdWeatherVisualizerProps>) => {  
    const partOfDayClasses : {
        [key: string]: boolean
    } = {
    }
    const partOfDay = GetPartOfDay(props.referenceTime, props.solarEvents)        
    const partOfDayClass = PartOfDay[partOfDay].toLocaleLowerCase() + "-time";
    partOfDayClasses[styles['part-of-day']] = true;
    partOfDayClasses[styles[partOfDayClass]] = true;
    const combinedPartOfDayClasses = classNames(partOfDayClasses);
        
    const showFog = props.categories.indexOf(WeatherCategory.Fog) != -1;
    const showRain = props.categories.indexOf(WeatherCategory.Rain) != -1;

    return (
        <div className={styles['weather-visualizer']}>      
            <div className={combinedPartOfDayClasses}>                
                {props.children}
            </div>      
            {showFog && (
                <div className={styles['weather-visualization']}>
                    <DwdFogVisual />
                </div>
            )}
            {showRain && (
                <div className={styles['weather-visualization']}>
                    <DwdRainVisual />
                </div>
            )}    
            {props.categories.indexOf(WeatherCategory.Cloudy) != -1 && (
                <div className={styles['weather-visualization']}>
                    <h1>Cloudy</h1>
                </div>
            )}                     
        </div>
    )
}

function GetPartOfDay(now: Date, solarEvents?: SolarEvents | null): PartOfDay {    
    if(!solarEvents) return PartOfDay.Day;
    if(solarEvents.dawn < now && now < solarEvents.sunrise) return PartOfDay.Twilight;
    if(solarEvents.sunset < now && now < solarEvents.dusk) return PartOfDay.Twilight;
    if(solarEvents.dawn < now && now < solarEvents.dusk) return PartOfDay.Day;      
    return PartOfDay.Night;
}

export default DwdWeatherVisualizer;