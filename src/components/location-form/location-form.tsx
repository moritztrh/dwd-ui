import { FormEvent } from 'react';
import DwdButton, { DwdButtonType } from '../shared/dwd-button';
import DwdInput, { DwdInputType } from '../shared/dwd-input';
import { Coordinates, ZipCode } from '../../lib/location';
import styles from './location-form.module.css'

type LocationFormProps = {
    onSubmit: (location: Coordinates | ZipCode) => void;
}

const LocationForm = (props: LocationFormProps) => {

    const onZipSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        let rawZip = formData.get("zip")?.toString() ?? "";
        props.onSubmit(new ZipCode(rawZip));
    }

    const autoDetect = () => {
        navigator.geolocation.getCurrentPosition(p => {
            var coordinates = new Coordinates(p.coords.longitude, p.coords.latitude);
            props.onSubmit(coordinates);
        },
        err => console.log(err))
    }

    return (
        <div className={styles["location-form"]}>
            <form onSubmit={onZipSubmit}>         
                <DwdInput label="Postleitzahl" field="zip" type={DwdInputType.Number} />
                <DwdButton type={DwdButtonType.Primary}>
                    Suchen
                </DwdButton>
            </form>
            <DwdButton type={DwdButtonType.Primary} onClick={autoDetect}>
                Via aktuelle Position
            </DwdButton>          
        </div>    
    )
}

export default LocationForm;