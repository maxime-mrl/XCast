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
  const forecastWidth = useAppStore.use.forecastWidth();

  // refs for events listeners
  const controllerRef = useRef<AbortController|null>(null);

  // update forecast when position changes
  useEffect(() => {
    if (!position) return;
    getForecast(position);
  }, [position, getForecast]);

  // as far as i can tell one of the only way to properly do this is with a callbackref
  // + it works (yay)
  // - cleanup is teadious as you will see -- fixed with abortcontroller -> see youtube.com/watch?v=2sdXSczmvNc
  // for now it's only needed here since i don't listen anything -- for meteogramm and sounding there is other things that change after init so it work
  // see github.com/facebook/react/issues/15176
  const resizerRefHandler = useCallback((resizer: HTMLDivElement | null) => {
    // handle cleanup
    if (controllerRef.current) controllerRef.current.abort();
    // set refs
    controllerRef.current = new AbortController();
    const { signal } = controllerRef.current;

    // check that dom is here
    if (!resizer) return;
    // init resizing
    let isResizing = false;
    // listen for events
    resizer.addEventListener("mousedown", () => isResizing = true, { signal });
    document.addEventListener("mouseup", () => isResizing = false, { signal });
    document.addEventListener("mousemove", (e) => isResizing && updateForecastWidth(e), { signal });
  }, [updateForecastWidth]);

  return (
    <div className={`forecast-container ${position ? "active" : ""}`} style={{width: forecastWidth*100+"%"}}>
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
          <a href="#meteogram" className="nav-btn link">Météogramme</a>
          <a href="#sounding" className="nav-btn link">Emagramme</a>
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
