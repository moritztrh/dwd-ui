'use client'

import styles from './page.module.css'
import { useSearchParams } from "next/navigation"
import WeatherForecast from './weather-forecast';


export default function WeatherOverviews(){
    const searchParams = useSearchParams();
    const zip = searchParams.get("zip");
    let lon: number | null = null;
    let lat: number | null = null;

    if(!zip){
        const lonRaw = searchParams.get("lon");
        const latRaw = searchParams.get("lat");
        if(lonRaw && latRaw){
            lon = Number.parseFloat(lonRaw);
            lat = Number.parseFloat(latRaw);
        }
    }
    
    return (
        <main className={styles.main}>      
            <WeatherForecast zip={zip} lon={lon} lat={lat}/>     
        </main>        
    )
}