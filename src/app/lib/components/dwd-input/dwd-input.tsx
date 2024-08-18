import styles from "./dwd-input.module.css";

export enum DwdInputType {
    Text = "text",
    Number = "number"
}

export type DwdInputProps = {
    label: string
    field: string;    
    type: DwdInputType
}
    

export default function DwdInput(props: DwdInputProps) {    
    return (
        <>
            <div className={styles["form-group"]}>
                <input required className={styles["form-field"]} type={props.type} placeholder={props.label} name={props.field} />
                <label className={styles["form-field-label"]} htmlFor={props.field}>{props.label}</label>
            </div>
        </>
    )
}