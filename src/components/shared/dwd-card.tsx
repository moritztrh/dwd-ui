import classNames from 'classnames';
import styles from './dwd-card.module.css'
import { PropsWithChildren } from "react";
import { Link } from 'react-router-dom';


type DwdCardProps = {
    href?: string    
}

const DwdCard = (props: PropsWithChildren<DwdCardProps>) => {
    
    const classes = [styles['dwd-card']]
    const isClickable = props.href
    if(isClickable){
        classes.push(styles['clickable'])
    }

    const component = (
        <div className={classNames(classes)}>
            {props.children}
        </div>
    );

    if(isClickable){
        return (
            <Link to={props.href!} className={styles['link']}>
                {component}
            </Link>
        )
    }


    return (
          component
    )
}

export default DwdCard;