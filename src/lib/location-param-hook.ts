import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Coordinates, ZipCode } from "./api-types";


export type LocationState = {
    location: Coordinates | ZipCode | null;
    setLocation: (location: Coordinates | ZipCode | null) => void;
}

function useLocationParams() : LocationState {
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

    useEffect(() => {
        const newLocation = getLocationFromUrl(searchParams);
        if(location === newLocation) return;
        setLocation(newLocation);
    }, [searchParams])

    const setLocationParams = (location: Coordinates | ZipCode | null) => {
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

    return {location, setLocation: setLocationParams}
}

export default useLocationParams;