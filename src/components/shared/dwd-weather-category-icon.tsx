import { WeatherCategory } from "../../lib/products/Description";
import { ReactComponent as ClearSvg } from "../../lib/icons/clear.svg";
import { ReactComponent as CloudySvg } from "../../lib/icons/cloudy.svg";
import { ReactComponent as FogSvg } from "../../lib/icons/fog.svg";
import { ReactComponent as RainSvg } from "../../lib/icons/rain.svg";
import { ReactComponent as SnowSvg } from "../../lib/icons/snow.svg";
import { ReactComponent as ThunderSvg } from "../../lib/icons/thunder.svg";

export enum WeatherIconSize {
    Small,
    Medium,
    Large
}

export type WeatherIconProps = {
    category: WeatherCategory
    size: WeatherIconSize
}

const SizeMap = new Map<WeatherIconSize, number>(
    [
        [WeatherIconSize.Small, 20],
        [WeatherIconSize.Medium, 25],
        [WeatherIconSize.Large, 35]
    ]
);

const DwdWeatherCategoryIcon = (props: WeatherIconProps) => {
    const size = SizeMap.get(props.size)!
    let category = props.category.toString();
    if(typeof props.category === 'number'){
        category = WeatherCategory[props.category].toString();
    }

    return (
        <div>                      
            {category == WeatherCategory[WeatherCategory.Clear] && (
                <ClearSvg width={size} />
            )}
            {category == WeatherCategory[WeatherCategory.Cloudy] && (
                <CloudySvg width={size} />
            )}
            {category == WeatherCategory[WeatherCategory.Fog] && (
                <FogSvg width={size} />
            )}
            {category == WeatherCategory[WeatherCategory.Rain] && (
                <RainSvg width={size} />
            )}
            {category == WeatherCategory[WeatherCategory.Snow] && (
                <SnowSvg width={size} />
            )}
            {category == WeatherCategory[WeatherCategory.Thunder] && (
                <ThunderSvg width={size} />
            )}
        </div>
    )
}

export default DwdWeatherCategoryIcon;