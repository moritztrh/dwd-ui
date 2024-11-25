export class ZipCode {
    value: string;
    
    constructor(value: string) {
        this.value = value;
    }
}

export class Coordinates {
    longitude: number;
    latitude: number;

    constructor(longitude: number, latitude: number) {
        this.longitude = longitude;
        this.latitude = latitude;        
    }
}

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