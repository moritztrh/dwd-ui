import Image from "next/image";
import styles from "./page.module.css";
import WeatherForecast from "./ui/weather/weather-forecast";


export default async function Home() {  
  return (    
    <main className={styles.main}>
      <WeatherForecast />     
    </main>
  );
}
