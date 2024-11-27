import styles from './dwd-weather-chart.module.css';
import { AirTemperature, AirTemperatureResult } from "../../lib/products/AirTemperature";
import { WeatherCategory, WeatherDescription, WeatherDescriptionResult } from '../../lib/products/Description';
import { ValueType } from '../../lib/api-types';
import { LinePath } from "@visx/shape";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AxisBottom, AxisLeft, TickFormatter } from "@visx/axis";
import { GridRows } from '@visx/grid';
import { Text } from '@visx/text';


export type DwdTemperatureChartProps = {
    temperature: AirTemperatureResult | null;
    descriptions: WeatherDescriptionResult | null;
    width?: number;
    height?: number;
}

type ValueCollections<T> = {
    measurements: T[];
    forecasts: T[];
}

const DwdWeatherChart = (props: DwdTemperatureChartProps) => {    
    if(!props?.temperature) return <div>No Data</div>

    const width = props.width ?? 800;
    const height = props.height ?? 400;

    const margin = {top: 75, right: 50, bottom: 75, left: 50};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = scaleTime<number>({
        domain: [props.temperature.values[0].time, props.temperature.values[props.temperature.values.length-1].time],
        range: [0, innerWidth]
    });

    const getXPosition = (d: Date) => xScale(d);

    const min = (props.temperature.min?.temperature ?? 0);
    const max = (props.temperature.max?.temperature ?? 0);
    const room = (max - min)*0.05;

    const yScale = scaleLinear<number>({
        range: [innerHeight, 0],
        domain: [min-room, max+room],
        nice: true
    });


    const formatDate: TickFormatter<Date | any> = (date: Date) : string => {
        if(date.getHours() == 0) return date.toLocaleDateString();
        return date.toLocaleTimeString();
    }

    const airTempData = getTemperature(props.temperature);
    const descriptions = getDescriptions(props.descriptions);

    return (
        <div className={styles["chart-container"]}>
            <svg width={width} height={height}>
                <g transform={`translate(${margin.left}, ${margin.top})`}>                    
                    <GridRows scale={yScale} width={innerWidth}/>
                    {descriptions.measurements.filter((x,i) => i % 2 == 0).map(x => {
                        return (
                            <Text x={getXPosition(x.time)}                                   
                                  angle={-45}>{WeatherCategory[x.category]}</Text>
                        )
                    })}
                    {descriptions.forecasts.filter((x,i) => i % 2 != 0).map(x => {
                        return (
                            <Text x={getXPosition(x.time)}                                   
                                  angle={-45}>{WeatherCategory[x.category]}</Text>
                        )
                    })}   
                    <LinePath<AirTemperature> 
                        data={airTempData.measurements}
                        stroke={"rgb(0, 0, 0)"}
                        strokeWidth={3}
                        x={d => xScale(d.time)} 
                        y={d => yScale(d.temperature ?? 0)} />
                    <LinePath<AirTemperature> 
                        data={airTempData.forecasts}
                        stroke={"rgb(0, 0, 0)"}
                        strokeWidth={3}
                        strokeDasharray={"5 10"}
                        x={d => xScale(d.time)} 
                        y={d => yScale(d.temperature ?? 0)} />
                    <AxisLeft 
                        left={0}
                        scale={yScale}
                        numTicks={5} />
                    <AxisBottom 
                        top={innerHeight}
                        scale={xScale}
                        numTicks={10}                        
                        tickFormat={formatDate} />
               
                </g>
            </svg>
        </div>
    )
};

function getTemperature(data: AirTemperatureResult | null) : ValueCollections<AirTemperature> {
    let measurements: AirTemperature[] = [];
    let forecasts: AirTemperature[] = []
    if(!data) return {measurements, forecasts};

    data.values.forEach(x => {        
        if(x.type === ValueType.Measurement){
            measurements.push(x);
        } else {
            forecasts.push(x);
        }
    });
    
    if(forecasts.length > 0){
        measurements.push(forecasts[0])
    }

    return {measurements, forecasts};
}

function getDescriptions(data: WeatherDescriptionResult | null) : ValueCollections<WeatherDescription> {
    let measurements: WeatherDescription[] = [];
    let forecasts: WeatherDescription[] = []
    if(!data) return {measurements, forecasts};

    data.values.forEach(x => {        
        if(x.type === ValueType.Measurement){
            measurements.push(x);
        } else {
            forecasts.push(x);
        }
    });

    return {measurements, forecasts};
}

export default DwdWeatherChart;