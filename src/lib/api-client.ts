import { Coordinates, ZipCode } from "./location";

export type WeatherStationData = {
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

export type ProductResult = {
    product: String;
    values: TimeSeriesValue[]
}

export type TimeSeriesValue = any & {
    time: Date;    
}

export class DwdApiClient {
    private baseUrl: string;
        
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;        
    }

    public async getWeather(location: Coordinates | ZipCode, from: Date, to: Date) : Promise<WeatherStationData> {
        
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

    private async parseWeatherResponse(response: Response): Promise<WeatherStationData> {
        let data : WeatherStationData = await response.json();        
        let adjusted: WeatherStationData = {
            station: data.station,
            distance: data.distance,
            from: data.from,
            to: data.to,
            results: data.results.map(x => {
                return {
                    product: x.product,
                    values: x.values.map( y => {
                        return {
                            time: new Date(y.time),
                            ...y
                        }
                    })
                }
            })
        }
        return adjusted;
    }
    
}