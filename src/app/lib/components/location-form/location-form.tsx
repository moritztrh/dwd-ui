'use client'

import styles from "./location-form.module.css";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import DwdInput, { DwdInputType } from "../dwd-input/dwd-input";
import DwdButton, { DwdButtonType } from "../dwd-button/dwd-button";

export default function LocationForm(){
    
    const router = useRouter();

    async function onZipSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();
    
        const formData = new FormData(event.currentTarget);    
        let zip = formData.get("zip");
        router.push(`/weather?zip=${zip}`)
    }

    async function onLocationSubmit() {
        await navigator.geolocation.getCurrentPosition(
            p => {
                router.push(`/weather?lon=${p.coords.longitude}&lat=${p.coords.latitude}`)
            },
            err => console.log(err)
        );
    }
    
    return (
    <>
        <div className={styles["location-form"]}>
            <form onSubmit={onZipSubmit}>         
                <DwdInput label="Postleitzahl" field="zip" type={DwdInputType.Number} />
                <DwdButton type={DwdButtonType.Primary}>
                    Suchen
                </DwdButton>
            </form>
            <DwdButton type={DwdButtonType.Primary} onClick={onLocationSubmit}>
                Via aktuelle Position
            </DwdButton>          
        </div>    
    </>
    )
}