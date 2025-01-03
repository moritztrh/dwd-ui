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
       for(let i=0; i<this.values.length-1; i++){
        let cursor = this.values[i];
        if (cursor.time < date) continue;        
        return cursor;
       }
       return null;
    }

    setStats(){
        var countMap = new Map<WeatherCategory, number>();
        this.values.forEach(x => {
            let match = countMap.get(x.category);
            if(!match){
                countMap.set(x.category, 1)
            } else {
                countMap.set(x.category, match + 1);
            }
        });
        
        Array.from(countMap).sort((a,b) => b[1]-a[1]).forEach(([cat, count]) => {
            let share = Math.round((count/this.values.length)*10)/10;
            this.categoryShares.push({category: cat, share: share});            
        });        
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