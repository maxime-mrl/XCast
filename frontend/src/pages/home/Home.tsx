import { Forecast, Map, Settings } from "@containers";
import "./Home.css";

export default function Home() {
    return (
        <div className="home">
            <div className="forecast">
                <Forecast />
                <Map />
            </div>
            <Settings />
        </div>
    )
}