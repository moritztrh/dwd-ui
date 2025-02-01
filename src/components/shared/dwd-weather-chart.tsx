import styles from './dwd-weather-chart.module.css';
import { AirTemperature, AirTemperatureResult } from "../../lib/products/AirTemperature";
import { WeatherCategory, WeatherDescription, WeatherDescriptionResult } from '../../lib/products/Description';
import { TimeSeriesValue, ValueType } from '../../lib/api-types';
import { Bar, Line, LinePath } from "@visx/shape";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AxisBottom, AxisLeft, AxisTop, TickFormatter } from "@visx/axis";
import { GridColumns, GridRows } from '@visx/grid';
import { Text } from '@visx/text';
import { SolarEvents } from '../../lib/solar-events';
import { ScaleSVG, useParentSize } from '@visx/responsive';
import { useCallback, useMemo } from 'react';
import { Tooltip, useTooltip, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { AddHours, GetStartOfDay, GetStartOfHour } from '../../lib/date-time';
import DwdWeatherCategoryIcon, { WeatherIconSize } from './dwd-weather-category-icon';
import DwdCard from './dwd-card';
import DwdWeatherChartTooltip from './dwd-weather-chart-tooltip';

export type DwdTemperatureChartProps = {
    temperature: AirTemperatureResult | null;
    descriptions: WeatherDescriptionResult | null;
    solarEvents: SolarEvents | null;
    onHover?: (time: Date) => void
}

type ValueCollections<T> = {
    measurements: T[];
    forecasts: T[];
}

const DwdWeatherChart = (props: DwdTemperatureChartProps) => {
    const { parentRef, width, height } = useParentSize({ debounceTime: 150, enableDebounceLeadingCall: true })
    const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop } = useTooltip<{ date: Date, temperature: number, description: WeatherCategory }>()

    const startOfHour = GetStartOfHour(new Date());
    const scaleValues = useMemo(
        () => getScaleValues(props.temperature, startOfHour),
        [props.temperature, startOfHour]
    );
    const dimensions = useMemo(
        () => getDimensions(width, height),
        [width, height]
    );

    const xScale = useMemo(() => scaleTime<number>({
            domain: [scaleValues.minTime, scaleValues.maxTime],
            range: [0, dimensions.innerWidth],        
        }),
        [scaleValues, dimensions]);

    const xScaleTicks = useMemo(() => {
        if(width > 900) return 10;
        if(width > 645) return 7;
        return 3;
    }, [width])
    

    const yScale = useMemo(() => {
        const room = (scaleValues.maxTemp - scaleValues.minTemp) * 0.05;
        return scaleLinear<number>({
            range: [dimensions.innerHeight, 0],
            domain: [scaleValues.minTemp - room, scaleValues.maxTemp + room],
            nice: true
        });
    },
        [dimensions, scaleValues]);

    const airTempData = useMemo(
        () => getTemperature(props.temperature),
        [props.temperature]
    );
    
    const dawnX = xScale(props.solarEvents?.dawn!)
    const sunriseX = xScale(props.solarEvents?.sunrise!)

    const sunsetX = xScale(props.solarEvents?.sunset!)
    const duskX = xScale(props.solarEvents?.dusk!)

    const handleShowTooltip = useCallback((event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
        const { x } = localPoint(event) || { x: 0 }
        const date = xScale.invert(x - dimensions.margins.left);
       
        const temperatureAtPoint = calculateTemperature(date);
        const descriptionAtPoint = getNearestDescription(date);

        showTooltip({
            tooltipData: {
                date: date,
                temperature: temperatureAtPoint,
                description: descriptionAtPoint
            },
            tooltipLeft: x - dimensions.margins.left,
            tooltipTop: yScale(temperatureAtPoint)
        });
        if (props?.onHover) props.onHover(date);
    }, [showTooltip, xScale, yScale]);

    const calculateTemperature = (date: Date) => {
        const temperaturePair = getLowerAndUpperValue(props.temperature!.values!, date);
        const deltaY = yScale(temperaturePair.upper.temperature!) - yScale(temperaturePair.lower.temperature!);
        const deltaX = xScale(temperaturePair.upper.time) - xScale(temperaturePair.lower.time);
        const m = deltaY / deltaX;
        const n = yScale(temperaturePair.upper.temperature!) - xScale(temperaturePair.upper.time) * m;
        return yScale.invert(xScale(date) * m + n);
    }

    const getNearestDescription = (date: Date) => {
        const descriptionPair = getLowerAndUpperValue(props.descriptions!.values!, date);
        const descriptionAtPoint = date.getTime() - descriptionPair.lower.time.getTime() < descriptionPair.upper.time.getTime() - date.getTime()
            ? descriptionPair.lower.category
            : descriptionPair.upper.category;        
        return descriptionAtPoint;
    }

    const handleHideTooltip = () => {
        hideTooltip();
        if (props?.onHover) props.onHover(new Date());
    }

    const formatDate: TickFormatter<Date | any> = (date: Date): string => {
        if (date.getHours() == 0) return date.toLocaleDateString();
        return date.toLocaleTimeString();
    }

    return (
        <div ref={parentRef} className={styles["chart-container"]}>
            <DwdCard>
                <ScaleSVG key={1} width={width} height={height}>
                    <g transform={`translate(${dimensions.margins.left}, ${dimensions.margins.top})`}>
                        <rect className={styles["early-morning"]}
                            x={0}
                            width={dawnX}
                            height={dimensions.innerHeight} />
                        <rect className={styles["sunrise"]}
                            x={dawnX}
                            width={sunriseX - dawnX}
                            height={dimensions.innerHeight} />
                        <rect className={styles["sunset"]}
                            x={sunsetX}
                            width={duskX - sunsetX}
                            height={dimensions.innerHeight} />
                        <rect className={styles["night"]}
                            x={duskX}
                            width={dimensions.innerWidth - duskX}
                            height={dimensions.innerHeight} />

                        <GridRows scale={yScale} width={dimensions.innerWidth} stroke='rgba(255, 255, 255, 0.33)' />
                        <AxisTop 
                            top={0}
                            scale={xScale}
                            numTicks={xScaleTicks}
                            tickComponent={(x) => {                                   
                                const size = 50;
                                const date = xScale.invert(x.x);                                
                                const category = getNearestDescription(date);                             
                                                                
                                return (
                                    <foreignObject x={x.x - (size/4)} y={-size/1.5} width={size} height={size}>
                                        <DwdWeatherCategoryIcon category={category} size={WeatherIconSize.Medium} />
                                    </foreignObject>
                                )
                            }}
                            />                                               
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
                            labelProps={
                                {fill: 'white'}
                            }                            
                            tickLabelProps={
                                {fill: 'white'}
                            }/>
                        <AxisBottom
                            top={dimensions.innerHeight}
                            scale={xScale}
                            numTicks={xScaleTicks}
                            tickFormat={formatDate}
                            labelProps={
                                {fill: 'white'}
                            }                            
                            tickLabelProps={
                                {fill: 'white'}
                            } />
                        <Bar
                            x={0}
                            y={0}
                            width={dimensions.innerWidth}
                            height={dimensions.innerHeight}
                            fill='transparent'
                            onTouchStart={handleShowTooltip}
                            onTouchMove={handleShowTooltip}
                            onMouseMove={handleShowTooltip}
                            onMouseLeave={handleHideTooltip} />
                        {tooltipData && (                            
                            <g>                                        
                                <DwdWeatherChartTooltip x={tooltipLeft!}
                                                        y={tooltipTop!}
                                                        maxWidth={dimensions.innerWidth}
                                                        maxHeight={dimensions.innerHeight}
                                                        date={tooltipData.date}
                                                        temperature={tooltipData.temperature}
                                                        weatherCategory={tooltipData.description}
                                                        />                                  
                                <Line
                                    from={{ x: tooltipLeft, y: 0 }}
                                    to={{ x: tooltipLeft, y: dimensions.innerHeight }}
                                    stroke='white'
                                    strokeWidth={3}
                                    pointerEvents='none' />
                                <circle
                                    cx={tooltipLeft}
                                    cy={tooltipTop}
                                    r={5}
                                    fill='white'
                                    strokeWidth={2} />
                            </g>
                        )}
                    </g>
                </ScaleSVG>
                {tooltipData && (
                    <div>
                        <Tooltip
                            key={Math.random()}
                            top={height + dimensions.margins.top * 4}
                            left={tooltipLeft! - 12}
                            style={{
                                ...defaultStyles,
                                border: '1px solid black',
                                textAlign: 'center',
                                transform: 'translateX(50%)'
                            }}>
                            {tooltipData.date.toLocaleTimeString()}
                        </Tooltip>
                    </div>
                )}
            </DwdCard>

        </div >
    )
};

function getScaleValues(temperature: AirTemperatureResult | null, reference: Date): { minTime: Date, maxTime: Date, minTemp: number, maxTemp: number } {
    if (!temperature) {
        return {
            minTime: GetStartOfDay(reference),
            maxTime: AddHours(GetStartOfDay(reference), 24),
            minTemp: 0,
            maxTemp: 25
        }
    }
    return {
        minTime: temperature.values[0].time,
        maxTime: temperature.values[temperature.values.length - 1].time,
        minTemp: temperature.min?.temperature ?? 0,
        maxTemp: temperature.max?.temperature ?? 0,
    }
}

function getDimensions(width: number, height: number): { margins: { top: number, bottom: number, left: number, right: number }, innerHeight: number, innerWidth: number } {
    const marginVertical = 50;
    const marginHorizontal = 25;

    const useMarginVertical = height - marginVertical * 2 > 0;
    const useMarginHorizontal = width - marginHorizontal * 2 > 0;

    const margins = {
        top: useMarginVertical ? marginVertical : 0,
        bottom: useMarginVertical ? marginVertical : 0,
        right: useMarginHorizontal ? marginHorizontal : 0,
        left: useMarginHorizontal ? marginHorizontal : 0
    };

    const innerWidth = width - margins.left - margins.right
    const innerHeight = height - margins.top - margins.bottom;

    return {
        margins,
        innerHeight,
        innerWidth
    }
}

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

function getLowerAndUpperValue<T extends TimeSeriesValue>(data: T[], date: Date): { lower: T, upper: T } {
    let lower: T = data[0];
    let upper: T = data[1];

    for (let i = 0; i < data.length; i++) {
        let value = data[i];
        if (value.time < date) continue;

        lower = data[i > 0 ? i - 1 : 0];
        upper = data[i];
        break;
    }

    const result = {
        lower,
        upper
    }

    return result;
}

export default DwdWeatherChart;