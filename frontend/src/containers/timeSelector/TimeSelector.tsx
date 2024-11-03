import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';

import './TimeSelector.css';
import { useEffect, useState } from 'react';
import { useMapStore } from 'src/store/useMapStore';

const days = [
  "dim",
  "lun",
  "mar",
  "mer",
  "jeu",
  "ven",
  "sam",
]

export default function TimeSelector() {
  const userSettings = useMapStore.use.userSettings();
  const updateTime = useMapStore.use.updateTime();
  const [date, setDate] = useState("");
  useEffect(() => {
    if (userSettings.time) {
      const forecastDate = new Date(userSettings.time.replace("_", ":"));
      const hours = forecastDate.getHours() < 10 ? `0${forecastDate.getHours()}` : forecastDate.getHours();
      const minutes = forecastDate.getMinutes() < 10 ? `0${forecastDate.getMinutes()}` : forecastDate.getMinutes();
      setDate(`${days[forecastDate.getDay()]}. ${hours}:${minutes}`);
    }
  }, [userSettings.time])
  return (
    // 
    <div className='time-selector'>
      <div className="infos">
        {date}
      </div>
      <div className="selector">
        <div className="prev">
          <button onClick={() => updateTime({days:-1})}><FontAwesomeIcon icon={faAnglesLeft}/></button>
          <button onClick={() => updateTime({hours:-1})}><FontAwesomeIcon icon={faAngleLeft}/></button>
        </div>
        <div className='next'>
          <button onClick={() => updateTime({hours:1})}><FontAwesomeIcon icon={faAngleRight}/></button>
          <button onClick={() => updateTime({days:1})}><FontAwesomeIcon icon={faAnglesRight}/></button>
        </div>
      </div>
    </div>
  )
}
