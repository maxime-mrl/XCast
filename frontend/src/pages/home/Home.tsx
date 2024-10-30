import "./Home.css"
import { Forecast, Map, Settings, TimeSelector } from "@containers";

export default function Home() {
    return (
        <div className="home">
            <div className="forecast">
                <Forecast />
                <Map />
            </div>
            <Settings />
            <TimeSelector />
        </div>
    )
}