import { MouseEventHandler, PropsWithChildren } from "react";
import styles from "./dwd-button.module.css";

export enum DwdButtonType {
    Primary
}

export type DwdButtonProps = {    
    type: DwdButtonType    
    onClick?: MouseEventHandler<HTMLButtonElement>
}


export default function DwdButton(props: PropsWithChildren<DwdButtonProps>) {
    let classes = [
        styles["dwd-button"],        
    ];
    
    switch(props.type){        
        case DwdButtonType.Primary:
            classes.push(styles["primary-button"])
            break;
    }

    let className = classes.join(' ');

    return (
        <>
            <button type={props.onClick ? "button" : "submit"} 
                    className={className}
                    onClick={props.onClick}>
                {props.children}
            </button>
        </>
    )
}