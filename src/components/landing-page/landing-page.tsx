import styles from './landing-page.module.css'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { AddHours, GetLocalToday } from '../../lib/date-time';
import LocationForm from '../location-form/location-form';
import DwdPageLayout from '../shared/dwd-page-layout';
import { useEffect } from 'react';
import MultiDayOverview from './multi-day-overview/multi-day-overview';
import StationOverview from '../shared/station-overview';
import useWeather, { useWeatherMock } from '../../lib/weather-hook';
import { Coordinates, ZipCode } from '../../lib/api-types';
import useLocationParams from '../../lib/location-param-hook';
import DwdWeatherVisualizer, { DwdWeatherVisualizerProps } from '../shared/dwd-weather-visualizer';
import { WeatherCategory, WeatherDescriptionResult } from '../../lib/products/Description';
import { calculateSolarEvents } from '../../lib/solar-events';

const LandingPage = () => {
    const { location, setLocation } = useLocationParams();
    const [searchParams] = useSearchParams();

    const handleSubmit = async (location: Coordinates | ZipCode) => {
        setLocation(location);
    }

    const { data, loading, error, triggerWeather, resetWeather } = useWeather();
    useEffect(() => {
        if (location == null) {
            resetWeather();
            return;
        };

        const from = GetLocalToday();
        const to = AddHours(from, 24 * 10);
        triggerWeather(location, from, to);
    }, [location])


    const navigate = useNavigate();

    const handleDaySelect = (date: Date) => {
        const params = new URLSearchParams(searchParams);
        params.set("date", date.toISOString());
        const url = `/details?${params.toString()}`;
        navigate(url);
    }

    let visualizer: DwdWeatherVisualizerProps | undefined;
    if(data){
        const now = new Date();
        const forDate = data.results.map(x => x.getForDate(now));
        const descriptionsForDate = forDate.filter(x => x.product == "Weather Description")[0] as WeatherDescriptionResult;
        const descriptionsForNow = descriptionsForDate.getForTime(now);
        const solarEvents = calculateSolarEvents({longitude: data.station.longitude, latitude: data.station.latitude}, now);
        visualizer = {
            referenceTime: now,
            solarEvents: solarEvents,
            categories: descriptionsForNow != null ? [descriptionsForNow?.category] : []
        }        
    }


    if (loading) return <p>Loading ...</p>
    if (error) return <p>Error: {error}</p>

    return (        
        <DwdPageLayout title='Weather' visualizer={visualizer}>        
            <div className={styles["page-layout"]}>
                {
                    data == null
                        ? <div className={styles["location-form-container"]}><LocationForm onSubmit={handleSubmit} /></div>
                        : <div className={styles["data-container"]}>
                            <StationOverview station={data.station}
                                distance={data.distance} />
                            <MultiDayOverview data={data}
                                onDaySelect={handleDaySelect} />
                        </div>
                }
            </div>
        </DwdPageLayout>
    );
}


export default LandingPage;