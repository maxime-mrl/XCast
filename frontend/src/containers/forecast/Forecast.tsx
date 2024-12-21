import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { Meteogram, Sounding } from "@components";
import { useForecastStore } from "@store/useForecastStore";
import './Forecast.css';
import { useAppStore } from "@store/useAppStore";

export default function Forecast() {
  // get stored data
  const url = useLocation();
  const position = useForecastStore.use.position();
  const setPosition = useForecastStore.use.setPosition();
  const getForecast = useForecastStore.use.getForecast();
  const updateForecastWidth = useAppStore.use.updateForecastWidth();

  const resizerRef = useRef<null|HTMLDivElement>(null);

  // update forecast when position changes
  useEffect(() => {
    if (!position) return;
    getForecast(position);
  }, [position, getForecast]);

  // as far as i can tell one of the only way to properly do this is with a callbackref
  // + it works (yay)
  // - cleanup is teadious as you will see
  // for now it's only needed here since i don't listen anything -- for meteogramm and sounding there is other things that change so it work
  const resizerRefHandler = useCallback((resizer: HTMLDivElement | null) => {
    const container = document.querySelector(".forecastContainer") as HTMLElement | null;
    if (!resizer || !container) return;
    console.log("Node attached:", resizer);

    let isResizing = false;
    const handleMouseDown = () => {
      console.log("click")
      isResizing = true
    };
    const handleMouseUp = () => isResizing = false;
    const handleMove = (e:MouseEvent) => {
      if (!isResizing) return;
      updateForecastWidth(e, container);
    };

    resizer.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMove);
  }, [updateForecastWidth]);
  
  // useEffect(() => {
  //   const cleanup = resizerRefHandler(resizerRef.current);
  //   return cleanup; // Ensure cleanup happens on unmount or dependency changes
  // }, [resizerRefHandler]);
  // listen for resize
  // useEffect(() => {
  //   const container = document.querySelector(".forecastContainer") as HTMLElement | null;
  //   const resizer = document.querySelector(".resizer");
  //   console.log(container);
  //   console.log(resizer)
  //   if (!resizer || !container) return;
  //   let drag = false;
  //   const handleMouseDown = () => drag = false;
  //   const handleMouseUp = () => drag = true;
  //   const handleMove = (e:MouseEvent) => {
  //     if (!drag) return;
  //     updateForecastWidth(e, container);
  //   };

  //   resizer.addEventListener("mousedown", handleMouseDown);
  //   document.addEventListener("mouseup", handleMouseUp);
  //   document.addEventListener("mousemove", handleMove);

  //   return () => {
  //     resizer.removeEventListener("mousedown", handleMouseDown);
  //     document.removeEventListener("mouseup", handleMouseUp);
  //     document.removeEventListener("mousemove", handleMove);
  //   }
  // }, [updateForecastWidth, resizerRef]);

  return (
    <>
      <div className={`forecastContainer ${position ? "active" : ""}`}>
        {/* display sounding or meteogram */}
        {position && position.lng && position.lat &&
        <div>
          {url.hash.substring(1) === "sounding"
            ? <Sounding />
            : <Meteogram />
          }
          <div className="resizer" ref={resizerRefHandler}></div>
        </div> 
        }
        {/* navigation */}
        <nav className="forecast-nav">
            <a href="#meteogram">Météogramme</a>
            <a href="#sounding">Emagramme</a>
            <button onClick={() => setPosition(false)}  className="close-forecast">
              <FontAwesomeIcon icon={faXmark} />
            </button>
        </nav>
      </div>
    </>
  )
}
