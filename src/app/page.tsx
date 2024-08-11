import Image from "next/image";
import styles from "./page.module.css";
import WeatherReport from "./ui/weather/weather-report";

export default async function Home() {  
  return (    
    <main className={styles.main}>
      <WeatherReport />     
    </main>
  );
}
