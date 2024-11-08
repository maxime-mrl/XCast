import "./Home.css"
import { Forecast, Map, Settings } from "@containers";

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