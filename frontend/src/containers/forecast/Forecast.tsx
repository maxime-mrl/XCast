import React, { useContext } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Datactx from "../../context/DataContext.tsx";

import './Forecast.css'
import { LatLng } from 'leaflet';

export default function Forecast() {
  const { forecast:[position, setPosition] } = useContext(Datactx) as { forecast: [LatLng | false, (arg:any) => {}] };

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
