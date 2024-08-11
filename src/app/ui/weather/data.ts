import { TimeSeriesValue } from "@/app/lib/types/time-series";

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

export async function getData(zipCode: string, from: Date, to: Date) : Promise<WeatherStationData> {    
    let fromParameter = from.toISOString();
    let toParameter = to.toISOString();
    let uri = `https://dwd-api.azurewebsites.net/api/v1/weather?zipCode=${zipCode}&from=${fromParameter}&to=${toParameter}`
    const res = await fetch(uri);
    if(!res.ok){
        throw new Error("Failed to fetch data!");
    }    
    let data : WeatherStationData = await res.json();
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
                        value: Number(y.value.toFixed(1))
                    }
                })
            }
        })
    }
    return adjusted;
}

export type DailyWeatherStationData = {
    station: Station;
    distance: number;
    from: Date
    to: Date
    results: DailyProductResult[]
}

export type DailyProductResult = {
    product: String;        
    values: DailyProductValue[]
}

export type DailyProductValue = {
    date: Date;
    values: TimeSeriesValue[];
    min: TimeSeriesValue;
    max: TimeSeriesValue;
    avg: number;
}

export async function getDataByDate(zipCode: string, from: Date, to: Date) : Promise<DailyWeatherStationData> {
    var data = await getData(zipCode, from, to);
    var productResults = data.results.map(x => {
        let groupByDate = Object.groupBy(x.values, x => {                                              
            return x.time.toDateString();
        });        

        var values = Object.entries(groupByDate).map(([key, values]) => {                        
            let date = new Date(key);
            let min = values![0];
            let max = values![0];
            let sum = values![0].value;
            
            values!.forEach(v => {
                if(v.value < min.value) min = v;
                if(v.value > max.value) max = v;
                sum = sum + v.value;
            })
            
            let avg = Math.round(sum / values!.length);
            let result: DailyProductValue = {                             
                date: date,
                values: values!,
                min: min,
                max: max, 
                avg: avg
            }
            return result;
        });

        var productResult: DailyProductResult = {
            product: x.product,
            values: values.filter(x => x.values.length == 24).sort((x, y) => x.date.getHours() - y.date.getHours())
        }
        return productResult;
    });

    return {
        station: data.station,
        distance: data.distance,
        from: data.from,
        to: data.to,
        results: productResults
    }
}