export type TimeSeries = {
    values: TimeSeriesValue[]
}

export type TimeSeriesValue = {
    time: Date;
    value: number;   
}