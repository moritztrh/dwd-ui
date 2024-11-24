import { AirTemperatureResult } from "./products/AirTemperature";
import { Coordinates, ZipCode } from "./location";
import { UnknownProduct } from "./products/UnknownProduct";
import { WeatherDescriptionResult } from "./products/Description";

export type WeatherData = {
    station: Station;
    distance: number;
    from: Date
    to: Date
    results: ProductResult[]
}

export type Station = {
    id: String;
    name: String;
    latitude: number;
    longitude: number;
}

export interface TimeSeriesValue {
    time: Date;    
    type: ValueType
}

export enum ValueType {
    Measurement,
    Forecast
}

export interface ProductResult {
    product: string;
    values: TimeSeriesValue[]
        
    getForDate(date: Date): ProductResult;
}

export class DwdApiClient {
    private baseUrl: string;
        
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;        
    }

    public async getWeather(location: Coordinates | ZipCode, from: Date, to: Date) : Promise<WeatherData> {
        
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

        let uri = `${this.baseUrl}/weather?${parameters.join('&')}`; 
        
        const res = await fetch(uri);
        if(!res.ok){
            throw new Error("Failed to fetch data from api.")
        }
        
        return await this.parseWeatherResponse(res);
    }

    
    private async parseWeatherResponse(response: Response): Promise<WeatherData> {
        
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
}