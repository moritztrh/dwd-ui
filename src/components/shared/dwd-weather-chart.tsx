import styles from './dwd-weather-chart.module.css';
import { AirTemperature, AirTemperatureResult } from "../../lib/products/AirTemperature";
import { WeatherCategory, WeatherDescription, WeatherDescriptionResult } from '../../lib/products/Description';
import { ValueType } from '../../lib/api-types';
import { LinePath } from "@visx/shape";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AxisBottom, AxisLeft, TickFormatter } from "@visx/axis";
import { GridColumns, GridRows } from '@visx/grid';
import { Text } from '@visx/text';
import { SolarEvents } from '../../lib/solar-events';
import { ScaleSVG, useParentSize } from '@visx/responsive';


export type DwdTemperatureChartProps = {
    temperature: AirTemperatureResult | null;
    descriptions: WeatherDescriptionResult | null;
    solarEvents: SolarEvents | null;
}

type ValueCollections<T> = {
    measurements: T[];
    forecasts: T[];
}

const DwdWeatherChart = (props: DwdTemperatureChartProps) => {
    const {parentRef, width, height} = useParentSize({ debounceTime: 150, enableDebounceLeadingCall: true })
    if (!props?.temperature) return <div>No Data</div>

    const margin = { top: 75, right: 50, bottom: 75, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = scaleTime<number>({
        domain: [props.temperature.values[0].time, props.temperature.values[props.temperature.values.length - 1].time],
        range: [0, innerWidth]
    });

    const getXPosition = (d: Date) => xScale(d);

    const min = (props.temperature.min?.temperature ?? 0);
    const max = (props.temperature.max?.temperature ?? 0);
    const room = (max - min) * 0.05;

    const yScale = scaleLinear<number>({
        range: [innerHeight, 0],
        domain: [min - room, max + room],
        nice: true
    });


    const formatDate: TickFormatter<Date | any> = (date: Date): string => {
        if (date.getHours() == 0) return date.toLocaleDateString();
        return date.toLocaleTimeString();
    }

    const airTempData = getTemperature(props.temperature);
    const descriptions = getDescriptions(props.descriptions);

    const dawnX = xScale(props.solarEvents?.dawn!)
    const sunriseX = xScale(props.solarEvents?.sunrise!)

    const sunsetX = xScale(props.solarEvents?.sunset!)
    const duskX = xScale(props.solarEvents?.dusk!)

    return (
        <div ref={parentRef} className={styles["chart-container"]}>
            <ScaleSVG width={width} height={height}>
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    <rect className={styles["early-morning"]}
                        x={0}
                        width={dawnX}
                        height={innerHeight} />
                    <rect className={styles["sunrise"]}
                        x={dawnX}
                        width={sunriseX - dawnX}
                        height={innerHeight} />
                    <rect className={styles["sunset"]}
                        x={sunsetX}
                        width={duskX - sunsetX}
                        height={innerHeight} />
                    <rect className={styles["night"]}
                        x={duskX}
                        width={innerWidth - duskX}
                        height={innerHeight} />

                    <GridRows scale={yScale} width={innerWidth} stroke='rgba(255, 255, 255, 0.33)' />
                    {descriptions.measurements.filter((x, i) => i % 2 == 0).map(x => {
                        return (
                            <Text x={getXPosition(x.time)}
                                  angle={-45}
                                  fill='white'>
                                    {WeatherCategory[x.category]}
                            </Text>
                        )
                    })}
                    {descriptions.forecasts.filter((x, i) => i % 2 != 0).map(x => {
                        return (
                            <Text x={getXPosition(x.time)}
                                  angle={-45}
                                  fill='white'>
                                    {WeatherCategory[x.category]}
                            </Text>
                        )
                    })}
                    <LinePath<AirTemperature>
                        data={airTempData.measurements}
                        stroke={"white"}
                        strokeWidth={3}
                        x={d => xScale(d.time)}
                        y={d => yScale(d.temperature ?? 0)} />
                    <LinePath<AirTemperature>
                        data={airTempData.forecasts}
                        stroke={"white"}
                        strokeWidth={3}
                        strokeDasharray={"5 10"}
                        x={d => xScale(d.time)}
                        y={d => yScale(d.temperature ?? 0)} />
                    <AxisLeft
                        left={0}
                        scale={yScale}
                        numTicks={5}                        
                        label='Temperature'/>
                    <AxisBottom
                        top={innerHeight}
                        scale={xScale}
                        numTicks={10}                        
                        tickFormat={formatDate} />

                </g>
            </ScaleSVG>
        </div >
    )
};

function getTemperature(data: AirTemperatureResult | null): ValueCollections<AirTemperature> {
    let measurements: AirTemperature[] = [];
    let forecasts: AirTemperature[] = []
    if (!data) return { measurements, forecasts };

    data.values.forEach(x => {
        if (x.type === ValueType.Measurement) {
            measurements.push(x);
        } else {
            forecasts.push(x);
        }
    });

    if (forecasts.length > 0) {
        measurements.push(forecasts[0])
    }

    return { measurements, forecasts };
}

function getDescriptions(data: WeatherDescriptionResult | null): ValueCollections<WeatherDescription> {
    let measurements: WeatherDescription[] = [];
    let forecasts: WeatherDescription[] = []
    if (!data) return { measurements, forecasts };

    data.values.forEach(x => {
        if (x.type === ValueType.Measurement) {
            measurements.push(x);
        } else {
            forecasts.push(x);
        }
    });

    return { measurements, forecasts };
}

export default DwdWeatherChart;