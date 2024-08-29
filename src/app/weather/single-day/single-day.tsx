import { DailyWeatherStationData } from "../data"

export type SingleDayProps = {
    day: Date
    data: DailyWeatherStationData    
}

export default function SingleDay(props: SingleDayProps){        
    let temperature = props.data.results[0].values.filter(x => x.date.toDateString() == props.day.toDateString())[0];    
    return (
        <div>
            {
                temperature.values.map((x,idx) => {
                    return (<div key={idx}>{x.time.toTimeString()} {x.value}</div>)
                })
            }
        </div>
    )
}