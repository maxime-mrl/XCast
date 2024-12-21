import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { Meteogram, Sounding } from "@components";
import { useForecastStore } from "@store/useForecastStore";
import { useAppStore } from "@store/useAppStore";
import './Forecast.css';

export default function Forecast() {
  // get stored data
  const url = useLocation();
  const position = useForecastStore.use.position();
  const setPosition = useForecastStore.use.setPosition();
  const getForecast = useForecastStore.use.getForecast();
  const userSettings = useForecastStore.use.userSettings();
  const updateSettings = useForecastStore.use.updateSettings();
  const updateForecastWidth = useAppStore.use.updateForecastWidth();

  // refs for events listeners
  const handleMouseDown = useRef<null | (() => void)>();
  const handleMouseUp = useRef<null | (() => void)>();
  const handleMouseMove = useRef<null | ((e:MouseEvent) => void)>();
  const resizerRef = useRef<null | HTMLElement>();

  // update forecast when position changes
  useEffect(() => {
    if (!position) return;
    getForecast(position);
  }, [position, getForecast]);

  // as far as i can tell one of the only way to properly do this is with a callbackref
  // + it works (yay)
  // - cleanup is teadious as you will see
  // for now it's only needed here since i don't listen anything -- for meteogramm and sounding there is other things that change so it work
  // see github.com/facebook/react/issues/15176
  const resizerRefHandler = useCallback((resizer: HTMLDivElement | null) => {
    const container = document.querySelector(".forecast-container") as HTMLElement | null;

    // handle cleanup
    if (resizerRef.current && handleMouseDown.current && handleMouseUp.current && handleMouseMove.current) {
      resizerRef.current.removeEventListener("mousedown", handleMouseDown.current);
      document.removeEventListener("mouseup", handleMouseUp.current);
      document.removeEventListener("mousemove", handleMouseMove.current);
    }

    // check that dom is here
    if (!resizer || !container) return;
    let isResizing = false;
    // set the refs (for cleanup later)
    handleMouseDown.current = () => isResizing = true;
    handleMouseUp.current = () => isResizing = false;
    handleMouseMove.current = (e) => isResizing && updateForecastWidth(e, container);
    resizerRef.current = resizer;
    // listen for events
    resizerRef.current.addEventListener("mousedown", handleMouseDown.current);
    document.addEventListener("mouseup", handleMouseUp.current);
    document.addEventListener("mousemove", handleMouseMove.current);
  }, [updateForecastWidth]);

  return (
    <div className={`forecast-container ${position ? "active" : ""}`}>
      {/* display sounding or meteogram */}
      {position && position.lng && position.lat &&
      <>
        {url.hash.substring(1) === "sounding"
          ? <Sounding />
          : <Meteogram />
        }
      </> 
      }
      {/* resizing */}
      <div className="resizer" ref={resizerRefHandler}></div>
      {/* navigation */}
      <nav className="forecast-nav">
        <div className="main-nav">
          <a href="#meteogram" className="nav-btn">Météogramme</a>
          <a href="#sounding" className="nav-btn">Emagramme</a>
        </div>
        <div className="separator"></div>
        <div className="actions">
          {/* height selection */}
          <span className="height-select">
            <label htmlFor="height-select">Alt. max:</label>
            <span className="select">
              <select
                name="height-select"
                id="height-select"
                value={userSettings.maxHeight}
                onChange={(e) => updateSettings({ maxHeight: parseInt(e.target.value) })}
              >
                <option value="2000">2000m</option>
                <option value="3000">3000m</option>
                <option value="4000">4000m</option>
                <option value="5000">5000m</option>
                <option value="10000">10000m</option>
              </select>
            </span>
          </span>
          {/* close forecast */}
          <button onClick={() => setPosition(false)} className="close-forecast nav-btn">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </nav>
    </div>
  )
}
