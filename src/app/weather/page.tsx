'use client'

import { useEffect, useState } from "react";
import MultiDayOverview from './multi-day-overview/multi-day-overview';
import styles from './page.module.css'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import SingleDay from './single-day/single-day';
import { DailyWeatherStationData, getDailyWeatherByPosition, getDailyWeatherByZip } from './data';
import CurrentOverview from "./current-overview";

type GeoPosition = {
    longitude: number;
    latitude: number;
}

export default function WeatherOverviews(){

    function parseGeoPosition() : GeoPosition | null {        
        const lonRaw = searchParams.get("lon");
        const latRaw = searchParams.get("lat");
        if(lonRaw && latRaw){
            return {
                longitude: Number.parseFloat(lonRaw),
                latitude: Number.parseFloat(latRaw)
            }      
        }
        return null;
    }

    function parseDate() : Date | null {
        let day: Date | null = null;
        let rawDay = searchParams.get("date");
        if(rawDay){
            return new Date(rawDay);            
        }
        return null;
    }

    const searchParams = useSearchParams();
    const zip = searchParams.get("zip");    
    const geo = parseGeoPosition();

    const [data, setData] = useState<DailyWeatherStationData | null>(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {        
        let from = new Date()
        from.setHours(0, 0, 0, 0);

        let to = new Date();
        to.setDate(to.getDate() + 10)
        to.setHours(0, 0, 0, 0);

        
        if(zip){
            getDailyWeatherByZip(zip, from, to)
            .then((response) => {
                setData(response);
                setLoading(false);
            })
            .catch(console.error)
            return;
        }
                
        if(geo){
            getDailyWeatherByPosition(geo.longitude, geo.latitude, from, to)
            .then((response) => {
                setData(response);
                setLoading(false); 
            })
            .catch(console.error)
            return
        }
    }, [])

    const router = useRouter();
    function showDate(date: Date, zip: string | null, geo: GeoPosition | null){
        let url = zip 
            ? `/weather?zip=${zip}&date=${date.toISOString()}`
            : `/weather?lon=${geo!.longitude}&lat=${geo!.latitude}&date=${date.toISOString()}`;
        router.push(url);
    }

    let date = parseDate();

    if (isLoading) return <p>Loading ...</p>
    if (!data) return <p>No Data</p>

    return (
        <main className={styles.main}>
            <CurrentOverview station={data.station} temperature={data.results[0].values[0]}/>      
            {
                date 
                ? <SingleDay day={date} data={data} /> 
                : <MultiDayOverview data={data}
                                    onDaySelect={(date) => showDate(date, zip, geo)}/> 
            }                  
        </main>        
    )
}