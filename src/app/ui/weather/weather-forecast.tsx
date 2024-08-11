'use client'

import styles from "./weather-forecast.module.css";
import { use, useEffect, useState } from "react";
import { getDataByDate, DailyWeatherStationData } from "./data";
import DailyInfo from "./daily-info";

export default function WeatherReport() {
    const [data, setData] = useState<DailyWeatherStationData | null>(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        let from = new Date()
        from.setHours(0, 0, 0, 0);

        let to = new Date();
        to.setDate(to.getDate() + 10)
        to.setHours(0, 0, 0, 0);

        getDataByDate("45131", from, to)
            .then((response) => {
                setData(response);
                setLoading(false);
            })
            .catch(console.error)
    }, []);

    if (isLoading) return <p>Loading ...</p>
    if (!data) return <p>No Data</p>

    return (
    <div className={styles["weather-forecast"]}>
        <div className={styles["heading"]}>8-Day-Forecast</div>
        {data.results[0].values.map(x => {
            return (<DailyInfo key={x.date.toISOString()} date={x.date} temperature={x} />)
        })}
    </div>)
} 