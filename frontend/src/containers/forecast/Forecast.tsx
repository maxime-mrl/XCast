import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDataContext } from "../../context/DataContext";

import './Forecast.css'

export default function Forecast() {
  const { forecast:[position, setPosition] } = useDataContext();

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
