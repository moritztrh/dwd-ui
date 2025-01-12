import styles from './details-page.module.css'
import { useSearchParams } from "react-router-dom";
import useLocationParams from "../../lib/location-param-hook";
import useWeather, { useWeatherMock } from "../../lib/weather-hook";
import { AddHours, GetStartOfHour } from "../../lib/date-time";
import { useEffect, useState } from "react";
import DwdWeatherChart from "../shared/dwd-weather-chart";
import { AirTemperatureResult } from "../../lib/products/AirTemperature";
import { WeatherCategory, WeatherDescriptionResult } from "../../lib/products/Description";
import { SolarEvents, calculateSolarEvents } from "../../lib/solar-events";
import DwdPageLayout from "../shared/dwd-page-layout";
import StationOverview from '../shared/station-overview';
import { DwdWeatherVisualizerProps } from '../shared/dwd-weather-visualizer';

const DetailsPage = () => {
    const [date, setDate] = useState<Date | null>();
    const [visualizerProps, setVisualizerProps] = useState<DwdWeatherVisualizerProps>({
        referenceTime: new Date(),
        categories: [WeatherCategory.Clear],
        solarEvents: undefined
    });
    const { location } = useLocationParams();
    const [searchParams] = useSearchParams()

    const { data, loading, error, triggerWeather } = useWeather();
    const [solarEvents, setSolarEvents] = useState<SolarEvents | null>(null);

    useEffect(() => {
        const rawDate = searchParams.get("date");
        setDate(rawDate ? new Date(rawDate) : null);
    }, [searchParams])

    useEffect(() => {
        if (!location) return;
        triggerWeather(location!, date!, AddHours(date!, 24))
    }, [location]);

    useEffect(() => {
        if (!data || !date) return;
        const coordinates = { longitude: data.station.longitude, latitude: data.station.latitude }
        const events = calculateSolarEvents(coordinates, date);
        setSolarEvents(events);

        const now = new Date();
        const category = descriptions.getForTime(now)?.category ?? WeatherCategory.Clear;             
        setVisualizerProps({
            referenceTime: now,             
            solarEvents: solarEvents,            
            categories: [category]})
                        
    }, [data])

    if (loading) return <p>Loading ...</p>
    if (error) return <p>Error: {error}</p>
    if (!data) return <p></p>;

    const airTemp = data.results.filter(x => x instanceof AirTemperatureResult)[0] as AirTemperatureResult;
    const descriptions = data.results.filter(x => x instanceof WeatherDescriptionResult)[0] as WeatherDescriptionResult;    
        
    const handleHover = (time: Date) => {        
        const category = descriptions.getForTime(time)?.category ?? WeatherCategory.Clear;             
        setVisualizerProps({
            referenceTime: time,             
            solarEvents: solarEvents,            
            categories: [category]})
    }
    
    return (
        <DwdPageLayout title="Weather" visualizer={visualizerProps}>
            <div className={styles["meta"]}>
                <StationOverview station={data.station}
                                 distance={data.distance} />
                <h1>{date!.toLocaleDateString()}</h1>      
            </div>                     
            <div className={styles["chart-container"]}>             
                <DwdWeatherChart temperature={airTemp}
                                 descriptions={descriptions}
                                 solarEvents={solarEvents}
                                 onHover={handleHover}/>
            </div>
        </DwdPageLayout>)


}

export default DetailsPage;