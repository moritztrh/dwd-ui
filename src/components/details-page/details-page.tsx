import { useLocation, useSearchParams } from "react-router-dom";
import useLocationParams from "../../lib/location-param-hook";
import useWeather from "../../lib/weather-hook";
import { AddHours } from "../../lib/date-time";
import { useEffect, useState } from "react";

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

    return <div>
        <h1>{date!.toLocaleDateString()}</h1>
        <div><pre>{JSON.stringify(data, null, 2)}</pre></div>
    </div>
}

export default DetailsPage;