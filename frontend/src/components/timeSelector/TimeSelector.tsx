import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';

import { useForecastStore } from '@store/useForecastStore';
import './TimeSelector.css';

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
  const userSettings = useForecastStore.use.userSettings();
  const updateTime = useForecastStore.use.updateTime();

  const getDateStr = () => {
    if (!userSettings.time) return "";
    const forecastDate = new Date(userSettings.time);

    const hours = `${forecastDate.getHours()}`.padStart(2, "0");
    const minutes = `${forecastDate.getMinutes()}`.padStart(2, "0");
    
    return`${days[forecastDate.getDay()]}. ${hours}:${minutes}`;
  }
  

  return (
    <div className='time-selector'>
      <div className="infos">
        {getDateStr()}
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
