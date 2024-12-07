import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDataContext } from "@context";

import './Forecast.css'
import { useForecastStore } from "@store/useForecastStore";
import { useEffect, useState } from "react";
import { LatLng } from "leaflet";
import { Meteogram, Sounding } from "@components";
import { useLocation } from "react-router-dom";

export default function Forecast() {
  // set memory
  const [memTime, setMemTime] = useState(new Date("2000-01-01T00:00Z").toISOString());
  const [memPos, setMemPos] = useState(new LatLng(0,0));
  // get stored data
  const location = useLocation();
  const { forecast:[position, setPosition] } = useDataContext();
  const getForecast = useForecastStore.use.getForecast();
  const userSettings = useForecastStore.use.userSettings();
  // get new forecast when needed
  useEffect(() => {
    // check if entries changed enough to call again
    if ((!userSettings.time || !position) ||(memTime.split("T")[0] === userSettings.time.split("T")[0] && memPos === position)) return;
    // update memory
    setMemTime(userSettings.time);
    setMemPos(position);
    // update forecast
    getForecast(position);

  }, [position, getForecast, userSettings.time, memTime, memPos]);

  return (
    <>
      <div className={`forecastContainer ${position ? "active" : ""}`}>
        {position && position.lng && position.lat &&
        <>
          {location.hash.substring(1) === "sounding" &&
            <Sounding />
          }
          {location.hash.substring(1) === "meteogram" &&
            <Meteogram />
          }
        </> 
        }
        <nav className="forecast-nav">
            <a href="#meteogram">Météogramme</a>
            <a href="#sounding">Emagramme</a>
            <button onClick={() => setPosition(false)}  className="close-forecast">
              <FontAwesomeIcon icon={faXmark} />
            </button>
        </nav>
      </div>
    </>
  )
}
