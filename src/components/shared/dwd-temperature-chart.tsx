import styles from './dwd-temperature-chart.module.css';
import { LinePath, SplitLinePath } from "@visx/shape";
import { AirTemperature, AirTemperatureResult } from "../../lib/products/AirTemperature";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AxisBottom, AxisLeft, TickFormatter } from "@visx/axis";
import { GridRows } from '@visx/grid';
import { ValueType } from '../../lib/api-types';

export type DwdTemperatureChartProps = {
    data: AirTemperatureResult | null;
    width?: number;
    height?: number;
}

const DwdTemperatureChart = (props: DwdTemperatureChartProps) => {    
    if(!props?.data) return <div>No Data</div>

    const width = props.width ?? 800;
    const height = props.height ?? 400;

    const margin = {top: 20, right: 20, bottom: 50, left: 50};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = scaleTime<number>({
        domain: [props.data.values[0].time, props.data.values[props.data.values.length-1].time],
        range: [0, innerWidth]
    });

    const min = (props.data.min?.temperature ?? 0);
    const max = (props.data.max?.temperature ?? 0);
    const room = (max - min)*0.05;

    const yScale = scaleLinear<number>({
        range: [innerHeight, 0],
        domain: [min-room, max+room],
        nice: true
    });

    const dateFormat: TickFormatter<Date | any> = (date: Date) : string => {
        if(date.getHours() == 0) return date.toLocaleDateString();
        return date.toLocaleTimeString();
    }

    let measurements: AirTemperature[] = [];
    let forecasts: AirTemperature[] = []
    props.data.values.forEach(x => {        
        if(x.type === ValueType.Measurement){
            measurements.push(x);
        } else {
            forecasts.push(x);
        }
    });
    
    if(forecasts.length > 0){
        measurements.push(forecasts[0])
    }
    

    return (
        <div className={styles["chart-container"]}>
            <svg width={width} height={height}>
                <g transform={`translate(${margin.left}, ${margin.top})`}>                    
                    <GridRows scale={yScale} width={innerWidth}/>
                    <LinePath<AirTemperature> 
                        data={measurements}
                        stroke={"rgb(0, 0, 0)"}
                        strokeWidth={3}
                        x={d => xScale(d.time)} 
                        y={d => yScale(d.temperature ?? 0)} />
                    <LinePath<AirTemperature> 
                        data={forecasts}
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
                        tickFormat={dateFormat} />
               
                </g>
            </svg>
        </div>
    )
};

export default DwdTemperatureChart;