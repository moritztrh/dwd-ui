import { useLocation, useSearchParams } from "react-router-dom";
import useLocationParams from "../../lib/location-param-hook";
import useWeather from "../../lib/weather-hook";
import { AddHours } from "../../lib/date-time";
import { useEffect, useState } from "react";
import DwdTemperatureChart from "../shared/dwd-temperature-chart";
import { AirTemperatureResult } from "../../lib/products/AirTemperature";

const DetailsPage = () => {
    const [date, setDate] = useState<Date | null>();
    const {location} = useLocationParams();
    const [searchParams] = useSearchParams()
    const {data, loading, error, triggerWeather} = useWeather();

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
    return <div>
        <h1>{date!.toLocaleDateString()}</h1>
        <div>
            <DwdTemperatureChart data={airTemp}/>
        </div>
    </div>
}

export default DetailsPage;