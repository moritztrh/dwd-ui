import { useLocation, useSearchParams } from "react-router-dom";
import useLocationParams from "../../lib/location-param-hook";
import useWeather, { useWeatherMock } from "../../lib/weather-hook";
import { AddHours } from "../../lib/date-time";
import { useEffect, useState } from "react";
import DwdWeatherChart from "../shared/dwd-weather-chart";
import { AirTemperatureResult } from "../../lib/products/AirTemperature";
import { WeatherDescriptionResult } from "../../lib/products/Description";

const DetailsPage = () => {
    const [date, setDate] = useState<Date | null>();
    const {location} = useLocationParams();
    const [searchParams] = useSearchParams()
    const {data, loading, error, triggerWeather} = useWeatherMock();

    useEffect(() => {       
        const rawDate = searchParams.get("date");         
        setDate(rawDate ? new Date(rawDate) : null);        
    }, [searchParams])

    useEffect(() => {
        if(!location) return;
        triggerWeather(location!, date!, AddHours(date!, 24))
    }, [location]);

    if(loading) return <p>Loading ...</p>
    if(error) return <p>Error: {error}</p>
    if(!data) return <p></p>;

    const airTemp = data.results.filter(x => x instanceof AirTemperatureResult)[0] as AirTemperatureResult;
    const descriptions = data.results.filter(x => x instanceof WeatherDescriptionResult)[0] as WeatherDescriptionResult;
    return <div>
        <h1>{date!.toLocaleDateString()}</h1>
        <div>
            <DwdWeatherChart temperature={airTemp} descriptions={descriptions}/>
        </div>
    </div>
}

export default DetailsPage;