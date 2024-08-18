'use client'

import styles from "./weather-forecast.module.css";
import { use, useEffect, useState } from "react";
import { getDailyWeatherByZip, DailyWeatherStationData, getDailyWeatherByPosition } from "./data";
import DailyOverview from "./daily-overview";
import CurrentOverview from "./current-overview";

export type WeatherForecastProps = {
    zip?: string | null
    lon?: number | null
    lat?: number | null
}

export default function WeatherForecast(props: WeatherForecastProps) {
    const [data, setData] = useState<DailyWeatherStationData | null>(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        let from = new Date()
        from.setHours(0, 0, 0, 0);

        let to = new Date();
        to.setDate(to.getDate() + 10)
        to.setHours(0, 0, 0, 0);

        if(props.zip){
            getDailyWeatherByZip(props.zip, from, to)
            .then((response) => {
                setData(response);
                setLoading(false);
            })
            .catch(console.error)
        }

        if(props.lon && props.lat){
            getDailyWeatherByPosition(props.lon, props.lat, from, to)
            .then((response) => {
                setData(response);
                setLoading(false);
            })
            .catch(console.error)
        }

    }, []);

    if (isLoading) return <p>Loading ...</p>
    if (!data) return <p>No Data</p>

    return (
    <div>
        <CurrentOverview station={data.station} temperature={data.results[0].values[0]}/>        
        <div className={styles["weather-forecast"]}>
            <div className={styles["heading"]}>8-Day-Forecast</div>
            {data.results[0].values.map(x => {
                return (<DailyOverview key={x.date.toISOString()} date={x.date} temperature={x} />)
            })}
        </div>
    </div>)
} 