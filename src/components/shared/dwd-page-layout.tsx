import { ReactNode, PropsWithChildren } from 'react';
import styles from './dwd-page-layout.module.css';

type DwdPageLayoutProps = {
    title: string
}

const DwdPageLayout = (props: PropsWithChildren<DwdPageLayoutProps>) => {
    return (
        <div className={styles["page-container"]}>
            {props.children}
        </div>
    )
}

export default DwdPageLayout;