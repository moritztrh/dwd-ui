import styles from './details-page.module.css'
import { useSearchParams } from "react-router-dom";
import useLocationParams from "../../lib/location-param-hook";
import useWeather, { useWeatherMock } from "../../lib/weather-hook";
import { AddHours } from "../../lib/date-time";
import { useEffect, useState } from "react";
import DwdWeatherChart from "../shared/dwd-weather-chart";
import { AirTemperatureResult } from "../../lib/products/AirTemperature";
import { WeatherDescriptionResult } from "../../lib/products/Description";
import { SolarEvents, calculateSolarEvents } from "../../lib/solar-events";
import DwdPageLayout from "../shared/dwd-page-layout";

const DetailsPage = () => {
    const [date, setDate] = useState<Date | null>();
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
    }, [data])

    if (loading) return <p>Loading ...</p>
    if (error) return <p>Error: {error}</p>
    if (!data) return <p></p>;

    const airTemp = data.results.filter(x => x instanceof AirTemperatureResult)[0] as AirTemperatureResult;
    const descriptions = data.results.filter(x => x instanceof WeatherDescriptionResult)[0] as WeatherDescriptionResult;
    return (
        <DwdPageLayout title="Weather">
            <div className={styles["content"]}>
                <h1>{date!.toLocaleDateString()}</h1>
                <pre>
                    {JSON.stringify(solarEvents)}
                </pre>
                <div className={styles["chart-container"]}>
                    <DwdWeatherChart temperature={airTemp}
                        descriptions={descriptions}
                        solarEvents={solarEvents} />
                </div>
            </div>
        </DwdPageLayout>)


}

export default DetailsPage;