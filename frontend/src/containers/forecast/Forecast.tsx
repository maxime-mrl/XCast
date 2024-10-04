import React, { useContext } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Datactx from "../../context/DataContext.tsx";

import './Forecast.css'

export default function Forecast() {
  const { forecast:[isOpen, setIsOpen] } = useContext(Datactx) as { forecast: [{lat?: number, lng?: number} | false, (arg:any) => {}] };
  console.log(isOpen)
  

  return (
    <>
      <div className={`forecastContainer ${isOpen ? "active" : ""}`}>
        <button className="burger-btn" id='forecast-btn' onClick={() => setIsOpen(false)}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        {isOpen && isOpen.lng && isOpen.lat ?
          <div className="loc">
            <p>Latitude: {isOpen.lat} Longitude: {isOpen.lng}</p>
          </div>
          :
          <></>
        }
      </div>
    </>
  )
}
