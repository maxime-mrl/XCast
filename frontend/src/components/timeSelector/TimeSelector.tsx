import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';

import { useForecastStore } from '@store/useForecastStore';
import './TimeSelector.css';

const days = [
  "dim", "lun", "mar", "mer", "jeu", "ven", "sam"
];

export default function TimeSelector() {
  // get stored data
  const userSettings = useForecastStore.use.userSettings();
  const updateTime = useForecastStore.use.updateTime();

  // parse date from iso
  const getDateStr = () => {
    if (!userSettings.time) return ""; // if no date return nothing
    const forecastDate = new Date(userSettings.time);
    // hours / minutes starting with 0 to always have to number
    const hours = `${forecastDate.getHours()}`.padStart(2, "0");
    const minutes = `${forecastDate.getMinutes()}`.padStart(2, "0");
    // dim. 00:00
    return`${days[forecastDate.getDay()]}. ${hours}:${minutes}`;
  }
  

  return (
    <div className='time-selector'>
      <div className="infos">
        {getDateStr()}
      </div>
      <div className="selector">
        <div className="prev">
          <button aria-label="Revenir d'un jour" onClick={() => updateTime({days:-1})}><FontAwesomeIcon icon={faAnglesLeft}/></button>
          <button aria-label="Revenir d'une heure" onClick={() => updateTime({hours:-1})}><FontAwesomeIcon icon={faAngleLeft}/></button>
        </div>
        <div className='next'>
          <button aria-label="Avancer d'une heure" onClick={() => updateTime({hours:1})}><FontAwesomeIcon icon={faAngleRight}/></button>
          <button aria-label="Avancer d'un jour" onClick={() => updateTime({days:1})}><FontAwesomeIcon icon={faAnglesRight}/></button>
        </div>
      </div>
    </div>
  )
}
