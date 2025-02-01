import styles from './dwd-weather-chart-tooltip.module.css';
import { WeatherCategory } from "../../lib/products/Description";
import DwdWeatherCategoryIcon, { WeatherIconSize } from "./dwd-weather-category-icon";

export type DwdWeatherChartTooltipProps = {
    x: number;
    y: number;
    maxWidth: number;
    maxHeight: number;
    date: Date;
    temperature: number;
    weatherCategory: WeatherCategory
}

const DwdWeatherChartTooltip = (props: DwdWeatherChartTooltipProps) => {    
    const width = 14 * 7.5;
    const x = getXPosition(props.x, width, props.maxWidth);
    return (
        <foreignObject 
            x={x}
            y={props.y! - 32}
            width={width}
            height={'5rem'}>
            <div className={styles['tool-tip-content']}>
                <div>
                    <DwdWeatherCategoryIcon category={props.weatherCategory} size={WeatherIconSize.Medium} />
                    {WeatherCategory[props.weatherCategory]}
                </div>
                <div>
                    {(Math.round(props.temperature * 100) / 100) + "°C"}
                </div>
            </div>
        </foreignObject>
    )
}

function getXPosition(x: number, width: number, max: number): number {    
    if(x + width < max) return x;
    return max - width;
}

export default DwdWeatherChartTooltip;