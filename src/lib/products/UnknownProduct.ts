import { ProductResult, TimeSeriesValue } from "../api-client";
import { GetStartOfDay, AddHours } from "../date-time";


export class UnknownProduct implements ProductResult {
    product: string;
    values: TimeSeriesValue[];

    constructor(product: string, values: TimeSeriesValue[]) {
        this.product = product;
        this.values = this.mapTimeSeriesValues(values);
    }

    mapTimeSeriesValues(values: TimeSeriesValue[]): TimeSeriesValue[] {
        return values.map(x => {
            var z = { ...x };
            z.time = new Date(x.time);
            return z;
        });
    }

    getForDate(date: Date): ProductResult {
        let lower = GetStartOfDay(date);
        let upper = AddHours(lower, 24);
        var dailyValues = this.values.filter(x => x.time >= lower && x.time <= upper);
        return new UnknownProduct(this.product, dailyValues);
    }
}
