import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import './TimeSelector.css'

export default function TimeSelector() {
  return (
    // <div className='time-selector'>
    //   <div className="day">
    //       <button><FontAwesomeIcon icon={faChevronLeft}/></button>
    //       <p>Day</p>
    //       <button><FontAwesomeIcon icon={faChevronRight}/></button>
    //   </div>
    //   <div className="hours">
    //     <p>-1</p>
    //     <p>00h</p>
    //     <p>+1</p>
    //   </div>
    // </div>
    <div className='time-selector'>
      <div className="infos">
        DAY. 0 -- 00h00
      </div>
      <div className="selector">
        <div className="prev">
          <button><FontAwesomeIcon icon={faAnglesLeft}/></button>
          <button><FontAwesomeIcon icon={faAngleLeft}/></button>
        </div>
        <div className='next'>
          <button><FontAwesomeIcon icon={faAngleRight}/></button>
          <button><FontAwesomeIcon icon={faAnglesRight}/></button>
        </div>
      </div>
    </div>
    // <div className='time-selector'>
    //   <div className="day">
    //       <FontAwesomeIcon icon={faChevronLeft}/>
    //       <p>Day</p>
    //       <FontAwesomeIcon icon={faChevronRight}/>
    //   </div>
    //   <div className="hours">
    //     <p>-1</p>
    //     <p>00h</p>
    //     <p>+1</p>
    //   </div>
    // </div>
  )
}
