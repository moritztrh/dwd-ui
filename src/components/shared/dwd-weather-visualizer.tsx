import styles from './dwd-weather-visualizer.module.css'
import { PropsWithChildren } from "react";
import { CalculateWeatherCategoryShare, WeatherCategory } from "../../lib/products/Description";
import { SolarEvents } from '../../lib/solar-events';
import classNames from 'classnames';
import DwdFogVisual from './dwd-fog-visual';
import DwdRainVisual from './dwd-rain-visual';
import DwdCloudyVisual from './dwd-cloudy-visual';

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
    const baseClasses = getBaseClasses(props.categories);       
    const partOfDayClasses = getPartOfDayClasses(props.referenceTime, props.solarEvents);        
    
    const showFog = props.categories.indexOf(WeatherCategory.Fog) != -1;
    const showRain = props.categories.indexOf(WeatherCategory.Rain) != -1;
    const showCloudy = props.categories.indexOf(WeatherCategory.Cloudy) != -1;
    
   /*  const showFog = false;
    const showRain = false;
    const showCloudy = true; */
    

    return (
        <div className={baseClasses}>      
            <div className={partOfDayClasses}>                
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
            {showCloudy && (
                <div className={styles['weather-visualization']}>
                   <DwdCloudyVisual />
                </div>
            )}                     
        </div>
    )
}

function getBaseClasses(categories: WeatherCategory[]): string {      
    let classes = [
        styles['weather-visualizer']    
    ];
    
    const shares = CalculateWeatherCategoryShare(categories);      
    const topCategory = typeof shares[0].category === 'string' 
        ? WeatherCategory[shares[0].category as keyof typeof WeatherCategory] 
        : shares[0].category;
    
    if(topCategory === 0){
        classes.push(styles['pleasant']);            
    } else {
        classes.push(styles['unpleasant']);
    }

    return classes.join(' ');
}

function getPartOfDayClasses(now: Date, solarEvents?: SolarEvents | null) : string {
    const partOfDayClasses : {
        [key: string]: boolean
    } = {
    }
    const partOfDay = getPartOfDay(now, solarEvents)        
    const partOfDayClass = PartOfDay[partOfDay].toLocaleLowerCase() + "-time";
    partOfDayClasses[styles['part-of-day']] = true;
    partOfDayClasses[styles[partOfDayClass]] = true;
    return classNames(partOfDayClasses);
}

function getPartOfDay(now: Date, solarEvents?: SolarEvents | null): PartOfDay {    
    if(!solarEvents) return PartOfDay.Day;
    if(solarEvents.dawn < now && now < solarEvents.sunrise) return PartOfDay.Twilight;
    if(solarEvents.sunset < now && now < solarEvents.dusk) return PartOfDay.Twilight;
    if(solarEvents.dawn < now && now < solarEvents.dusk) return PartOfDay.Day;      
    return PartOfDay.Night;
}

export default DwdWeatherVisualizer;