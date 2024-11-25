import { ProductResult, Station, WeatherData } from "../../../lib/api-types";
import { GetStartOfDay } from "../../../lib/date-time";


export type DailyWeatherData = {
    station: Station;
    distance: number;
    from: Date
    to: Date
    results: DailyProductResult[]
}

export type DailyProductResult = {
    date: Date;
    results: ProductResult[]
}

export function groupByDay(data: WeatherData): DailyWeatherData {    
    let allDates = data.results.flatMap(x => x.values.map(y => y.time));
    let dates = getUniqueDates(allDates);   
    let dailyProductResults: DailyProductResult[] = dates.map(date => {        
        return {date: date, results: data.results.map(x => x.getForDate(date))}
    });
    
    return {
        station: data.station,
        distance: data.distance,
        from: data.from,
        to: data.to,
        results: dailyProductResults
    }
}

function getUniqueDates(dates: Date[]): Date[] {
    return Array.from(new Set(dates.map(x => GetStartOfDay(x)).map(x => x.getTime()))).sort((a,b) => a - b).map(x => new Date(x)); 
}