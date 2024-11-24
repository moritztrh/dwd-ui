import styles from './landing-page.module.css'
import { useSearchParams } from 'react-router-dom';
import { DwdApiClient, WeatherData } from '../../lib/api-client';
import { AddHours, GetLocalToday } from '../../lib/date-time';
import { Coordinates, ZipCode } from '../../lib/location';
import LocationForm from '../location-form/location-form';
import DwdPageLayout from '../shared/dwd-page-layout';
import { useEffect, useState } from 'react';
import MultiDayOverview from './multi-day-overview/multi-day-overview';
import StationOverview from '../shared/station-overview';

const LandingPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [location, setLocation] = useState<Coordinates | ZipCode | null>(null);
    
    const getLocationFromUrl = (searchParams: URLSearchParams) : ZipCode | Coordinates | null  => {
        const zip = searchParams.get("zip")
        if(zip && zip.length == 5){
            return new ZipCode(zip);
        }
        
        const lonRaw = searchParams.get("lon");
        const latRaw = searchParams.get("lat");
        if(lonRaw && latRaw){
            return new Coordinates(Number.parseFloat(lonRaw), Number.parseFloat(latRaw)); 
        }
    
        return null;
    }
    
    const updateLocationInUrl = (location: Coordinates | ZipCode) => {
        const newParams = new URLSearchParams();
    
        if(location instanceof ZipCode){
            newParams.set("zip", location.value)        
        }
    
        if(location instanceof Coordinates){
            newParams.set("lon", location.longitude.toString())
            newParams.set("lat", location.latitude.toString())
        }
    
        setSearchParams(newParams)
    }

    const handleSubmit = async (location: Coordinates | ZipCode) => {
        updateLocationInUrl(location);
    }

    useEffect(() => {
        const newLocation = getLocationFromUrl(searchParams);
        if(location === newLocation) return;    
        setLocation(newLocation)
    }, [searchParams])

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<WeatherData | null>(null);
    
    const client = new DwdApiClient("https://dwd-api.azurewebsites.net/api/v1");
    
    useEffect(() => {                  
        if(location == null) {
            setData(null);
            return;
        };

        const fetchData = async () => {
            setIsLoading(true);            
            try {
                var from = GetLocalToday();                
                var to = AddHours(from, 24*10);    
                var response = await client.getWeather(location, from, to);
                setData(response);
            } catch(err){
                if (typeof err === "string"){
                    setError(err);
                } else if(err instanceof Error){
                    setError(err.message)
                }                
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [location])

    if(isLoading) return <p>Loading ...</p>

    return (
       <DwdPageLayout title='Weather'>      
            <div className={styles["page-layout"]}>                                   
                {
                    data == null 
                    ? <div className={styles["location-form-container"]}><LocationForm onSubmit={handleSubmit}/></div>
                    : <div className={styles["data-container"]}>
                        <StationOverview station={data.station} distance={data.distance}/>
                        <MultiDayOverview data={data}/>
                      </div> 
                }    
            </div>                         
       </DwdPageLayout>
    );
}


export default LandingPage;