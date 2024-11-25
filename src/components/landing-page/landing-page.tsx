import styles from './landing-page.module.css'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AddHours, GetLocalToday } from '../../lib/date-time';
import LocationForm from '../location-form/location-form';
import DwdPageLayout from '../shared/dwd-page-layout';
import { useEffect, useState } from 'react';
import MultiDayOverview from './multi-day-overview/multi-day-overview';
import StationOverview from '../shared/station-overview';
import useWeather from '../../lib/weather-hook';
import { Coordinates, ZipCode } from '../../lib/api-types';

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

    const {data, loading, error, triggerWeather, resetWeather} = useWeather();            
    useEffect(() => {             
        if(location == null) {         
            resetWeather();
            return;
        };

        const from = GetLocalToday();                
        const to = AddHours(from, 24*10);  
        triggerWeather(location, from, to);
    }, [location])

    const navigate = useNavigate();

    const handleDaySelect = (date: Date) => {
        navigate("/details");
    }

    if(loading) return <p>Loading ...</p>
    if(error) return <p>Error: {error}</p>

    return (
       <DwdPageLayout title='Weather'>      
            <div className={styles["page-layout"]}>                                   
                {
                    data == null 
                    ? <div className={styles["location-form-container"]}><LocationForm onSubmit={handleSubmit}/></div>
                    : <div className={styles["data-container"]}>
                        <StationOverview station={data.station} 
                                         distance={data.distance}/>
                        <MultiDayOverview data={data}
                                          onDaySelect={handleDaySelect}/>
                      </div> 
                }    
            </div>                         
       </DwdPageLayout>
    );
}


export default LandingPage;