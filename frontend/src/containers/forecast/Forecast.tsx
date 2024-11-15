import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDataContext } from "@context";

import './Forecast.css'
import { useForecastStore } from "@store/useForecastStore";
import { useEffect } from "react";

export default function Forecast() {
  const { forecast:[position, setPosition] } = useDataContext();
  const getForecast = useForecastStore.use.getForecast();
  const userSettings = useForecastStore.use.userSettings();
  useEffect(() => {
    console.log("position update")
    if (position) getForecast(position)
  }, [position, getForecast, userSettings.time])


  return (
    <>
      <div className={`forecastContainer ${position ? "active" : ""}`}>
        <button className="burger-btn" id='forecast-btn' onClick={() => setPosition(false)}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        {position && position.lng && position.lat ?
          <div className="loc">
            <p>Latitude: {position.lat} Longitude: {position.lng}</p>
          </div>
          :
          <></>
        }
      </div>
    </>
  )
}
