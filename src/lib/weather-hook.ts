import { AirTemperatureResult } from "./products/AirTemperature";
import { WeatherDescriptionResult } from "./products/Description";
import { UnknownProduct } from "./products/UnknownProduct";
import useFetch from "./fetch-hook";
import { Coordinates, WeatherData, ZipCode } from "./api-types";

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
    let data : WeatherData = await response.json();        
    let adjusted: WeatherData = {
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

export default useWeather;