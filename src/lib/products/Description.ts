import { ProductResult, TimeSeriesValue, ValueType } from "../api-types";
import { AddHours, GetStartOfDay } from "../date-time";


type WeatherCategoryShare = {
    category: WeatherCategory;
    share: number;
}

export class WeatherDescriptionResult implements ProductResult {
    product: string = "Weather Description";
    values: WeatherDescription[];
    categoryShares: WeatherCategoryShare[] = [];

    constructor(values: TimeSeriesValue[]) {
        this.values = this.mapTimeSeriesValues(values);
        if(this.values.length > 0){
            this.setStats();
        }
    }

    mapTimeSeriesValues(values: TimeSeriesValue[]): WeatherDescription[] {
        return values.map(x => {
            var raw = x as WeatherDescription;
            return new WeatherDescription(new Date(raw.time), raw.type, raw.category?.toString());
        })
    }
        
    getForDate(date: Date): ProductResult {
        let lower = GetStartOfDay(date);
        let upper = AddHours(lower, 24);
        var dailyValues = this.values.filter(x => x.time >= lower && x.time < upper);
        return new WeatherDescriptionResult(dailyValues);
    }

    getForTime(date: Date) : WeatherDescription | null {
       for(let i=0; i<this.values.length; i++){
        let cursor = this.values[i];
        if (cursor.time < date) continue;        
        return cursor;
       }
       return null;
    }

    setStats(){

        let categories = this.values.map(x => x.category);
        this.categoryShares = CalculateWeatherCategoryShare(categories);      
    }
}

export enum WeatherCategory {
    Clear,
    Cloudy,
    Fog,
    Rain,
    Snow,
    Thunder,
    Unknown
}

export function CalculateWeatherCategoryShare(categories: WeatherCategory[]) : WeatherCategoryShare[] {
    var countMap = new Map<WeatherCategory, number>();
    categories.forEach(x => {
        let match = countMap.get(x);
        if(!match){
            countMap.set(x, 1)
        } else {
            countMap.set(x, match + 1);
        }
    });
    
    return Array.from(countMap).sort((a,b) => b[1]-a[1]).map((kvp) => {
        let share = Math.round((kvp[1]/categories.length)*10)/10;
        return {category: kvp[0], share}
    });       
}

export class WeatherDescription implements TimeSeriesValue {
    time: Date;
    type: ValueType;
    category: WeatherCategory;    

    
    constructor(time: Date, type: ValueType, category?: string) {
        this.time = time;
        this.type = type;

        let key = category as keyof typeof WeatherCategory ?? "Unknown";
        this.category = WeatherCategory[key];        
    }
}