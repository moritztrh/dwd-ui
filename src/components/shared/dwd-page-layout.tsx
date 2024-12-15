import { ReactNode, PropsWithChildren } from 'react';
import styles from './dwd-page-layout.module.css';
import DwdWeatherVisualizer from './dwd-weather-visualizer';
import { WeatherCategory } from '../../lib/products/Description';

type DwdPageLayoutProps = {
    title: string
}

const DwdPageLayout = (props: PropsWithChildren<DwdPageLayoutProps>) => {
    return (
        <DwdWeatherVisualizer categories={[WeatherCategory.Clear, WeatherCategory.Rain]}>
            <div className={styles["page-container"]}>
                {props.children}
            </div>
        </DwdWeatherVisualizer>        
    )
}

export default DwdPageLayout;