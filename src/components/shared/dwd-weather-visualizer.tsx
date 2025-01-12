import styles from './dwd-weather-visualizer.module.css'
import { PropsWithChildren } from "react";
import { WeatherCategory } from "../../lib/products/Description";
import { SolarEvents } from '../../lib/solar-events';
import classNames from 'classnames';

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
    let categoryClasses : {
        [key: string]: boolean
    } = {        
    };

    props.categories?.forEach(x => { 
        let cat: string;
        if(typeof x === 'number' && WeatherCategory[x]){
            cat = WeatherCategory[x];
        } else if(typeof x === 'string' && Object.values(WeatherCategory).includes(x)){
            cat = x;
        } else {
            cat = WeatherCategory.Unknown.toString();
        }        
        let cssClass = cat.toLowerCase() + "-bg";                
        categoryClasses[styles[cssClass]] = true;         
    });  
    const combinedCategoryClasses = classNames(categoryClasses);

    const partOfDayClasses : {
        [key: string]: boolean
    } = {
    }
    const partOfDay = GetPartOfDay(props.referenceTime, props.solarEvents)        
    const partOfDayClass = PartOfDay[partOfDay].toLocaleLowerCase() + "-time";
    partOfDayClasses[styles['part-of-day']] = true;
    partOfDayClasses[styles[partOfDayClass]] = true;
    const combinedPartOfDayClasses = classNames(partOfDayClasses);

    return (
        <div className={combinedCategoryClasses}>            
            <div className={combinedPartOfDayClasses}>                
                {props.children}
            </div>                        
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