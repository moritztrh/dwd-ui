import styles from "./page.module.css";
import LocationForm from "./lib/components/location-form/location-form";

export default async function Home() {  
  return (    
    <div className={styles["location-form-container"]}>
      <h1>DWD Wetter</h1>
      <LocationForm />
    </div>
  );
}
