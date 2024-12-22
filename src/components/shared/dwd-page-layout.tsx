import { PropsWithChildren } from 'react';
import styles from './dwd-page-layout.module.css';
import DwdWeatherVisualizer, { DwdWeatherVisualizerProps } from './dwd-weather-visualizer';
import { WeatherCategory } from '../../lib/products/Description';

type DwdPageLayoutProps = {
    title: string
    visualizer?: DwdWeatherVisualizerProps
}

const DwdPageLayout = (props: PropsWithChildren<DwdPageLayoutProps>) => {
    
    const visualizerProps: DwdWeatherVisualizerProps = props.visualizer ?? {
        referenceTime: new Date(),
        categories: [WeatherCategory.Clear],        
    }
    
    return (
        <DwdWeatherVisualizer {...visualizerProps}>
            <div className={styles["page-container"]}>
                {props.children}
            </div>
        </DwdWeatherVisualizer>        
    )
}

export default DwdPageLayout;