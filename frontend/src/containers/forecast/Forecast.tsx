import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { Meteogram, Sounding } from "@components";
import { useForecastStore } from "@store/useForecastStore";
import './Forecast.css';

export default function Forecast() {
  // get stored data
  const url = useLocation();
  const position = useForecastStore.use.position();
  const setPosition = useForecastStore.use.setPosition();
  const getForecast = useForecastStore.use.getForecast();

  // update forecast
  useEffect(() => {
    if (!position) return;
    getForecast(position);
  }, [position, getForecast]);

  return (
    <>
      <div className={`forecastContainer ${position ? "active" : ""}`}>
        {position && position.lng && position.lat &&
        <>
          {url.hash.substring(1) === "sounding"
            ? <Sounding />
            : <Meteogram />
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
