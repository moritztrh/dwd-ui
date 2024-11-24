import { ProductResult, ValueType, TimeSeriesValue } from "../api-client";
import { GetStartOfDay, AddHours } from "../date-time";


export class AirTemperatureResult implements ProductResult {
    product: string = "Air Temperature";
    values: AirTemperature[];

    min?: AirTemperature;
    max?: AirTemperature;
    avg?: number;

    constructor(values: TimeSeriesValue[]) {
        this.values = this.mapTimeSeriesValues(values);
        if(this.values.length > 0){
            this.setStats();
        }
    }

    mapTimeSeriesValues(values: TimeSeriesValue[]): AirTemperature[] {
        return values.map(x => {
            var raw = x as AirTemperature;
            return new AirTemperature(new Date(raw.time), raw.type, raw.temperature);
        });
    }

    getForDate(date: Date): AirTemperatureResult {
        let lower = GetStartOfDay(date);
        let upper = AddHours(lower, 24);
        var dailyValues = this.values.filter(x => x.time >= lower && x.time < upper);
        return new AirTemperatureResult(dailyValues);
    }

    setStats(){
        let min = this.values[0];
        let max = this.values[0];
        
        let sum = 0;
        let values = 0;

        this.values.forEach(x => {
            if(x.temperature == null) return;
            if (min.temperature == null || x.temperature < min.temperature){
                min = x;
            }
            if (max.temperature == null || x.temperature > max.temperature){
                max = x;
            }

            sum += x.temperature;
            values++;
        })

        this.min = min;
        this.max = max;
        this.avg = Math.round((sum/values)*10)/10;
    }
}

export class AirTemperature implements TimeSeriesValue {
    time: Date;
    type: ValueType;
    temperature: number | null;

    constructor(time: Date, type: ValueType, temperature: number | null) {
        this.time = time;
        this.type= type;
        this.temperature = temperature;    
    }
}