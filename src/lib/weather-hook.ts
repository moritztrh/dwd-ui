import { AirTemperatureResult } from "./products/AirTemperature";
import { WeatherDescriptionResult } from "./products/Description";
import { UnknownProduct } from "./products/UnknownProduct";
import useFetch from "./fetch-hook";
import { Coordinates, WeatherData, ZipCode } from "./api-types";
import { useState } from "react";
import mockData from "./mock/api-response.json";

const BASE_URL = "https://dwd-api.azurewebsites.net/api/v1";

function buildUrl(location: Coordinates | ZipCode, from: Date, to: Date) : string {
    let parameters: string[] = [];

    if(location instanceof Coordinates){
        const longitude = `longitude=${location.longitude}`;
        const latitude = `latitude=${location.latitude}`;
        parameters.push(longitude);
        parameters.push(latitude);
    }

    if(location instanceof ZipCode){
        const zip = `zipCode=${location.value}`;
        parameters.push(zip);
    }
        
    let fromParameter = `from=${from.toISOString()}`;
    let toParameter = `to=${to.toISOString()}`;
    parameters.push(fromParameter);
    parameters.push(toParameter);

    let uri = `${BASE_URL}/weather?${parameters.join('&')}`;
    return uri;
}

async function parseWeatherResponse(response: Response): Promise<WeatherData> {        
    try {
        let data : WeatherData = await response.json();        
        let adjusted = parseWeatherData(data);  
        return adjusted;
    } catch(ex: unknown){
        throw new Error(`Error while parsing api response: ${ex}`)
    }    
}

function parseWeatherData(data: WeatherData) : WeatherData {
    try {     
        const adjusted: WeatherData = {
            station: data.station,
            distance: data.distance,
            from: data.from,
            to: data.to,
            results: data.results.map(x => {                                                
                switch(x.product){
                    case "AirTemperature":
                        return new AirTemperatureResult(x.values);
                    case "Description":
                        return new WeatherDescriptionResult(x.values);
                    default:
                        return new UnknownProduct(x.product, x.values);
                };    
            })
        }                
        return adjusted;
    } catch(ex: unknown){
        throw new Error(`Error while parsing data: ${ex}`)
    }    
}

export type WeatherFetchState = {
    data: WeatherData | null;
    loading: boolean;
    error: string | null;
    triggerWeather: (location: Coordinates | ZipCode, from: Date, to: Date) => void;
    resetWeather: () => void;
};


function useWeather() : WeatherFetchState {           
    const {data, loading, error, fetchData, resetData} = useFetch<WeatherData>(parseWeatherResponse);

    const triggerWeather = (location: Coordinates | ZipCode, from: Date, to: Date) => {
        const url = buildUrl(location, from, to);
        fetchData(url);
    };

    return {data, loading, error, triggerWeather, resetWeather: resetData};
}

export function useWeatherMock() : WeatherFetchState {
    const [data, setData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const triggerWeather = (location: Coordinates | ZipCode, from: Date, to: Date) => {
        setLoading(true);
        setError(null);
        
        setTimeout(() => {
            try {
                const mock: WeatherData = JSON.parse(JSON.stringify(mockData));
                const parsed = parseWeatherData(mock);
                parsed.results.forEach(r => {
                    r.values = r.values.filter(x => x.time >= from && x.time < to)
                });
                setData(parsed);
            } catch(err){
                setError("Error fetchin mock data.");
                setData(null);
            } finally {
                setLoading(false);
            }
        }, 500);
    };

    const resetWeather = () => {
        setData(null);
        setError(null);
        setLoading(false);
    }

    return { data, loading, error, triggerWeather, resetWeather };
}

export default useWeather;