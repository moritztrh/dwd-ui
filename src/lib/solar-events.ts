import SunCalc from 'suncalc';
import { Coordinates } from "./api-types";
import { AddHours } from './date-time';

export type SolarEvents = {
    sunrise: Date;
    sunset: Date;
    dawn: Date;
    dusk: Date;
}

export const calculateSolarEvents = (coordinates: Coordinates, date: Date): SolarEvents => {

    const offset = date.getTimezoneOffset() / 60 * -1;
    const dateUtc = AddHours(date, offset)
    const result = SunCalc.getTimes(dateUtc, coordinates.latitude, coordinates.longitude);

    return {
        sunrise: result.sunrise,
        sunset: result.sunset,
        dawn: result.dawn,
        dusk: result.dusk
    }
};