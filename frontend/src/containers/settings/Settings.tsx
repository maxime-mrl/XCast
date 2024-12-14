import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useForecastStore } from "@store/useForecastStore";

import './Settings.css'
import { useEffect, useState } from "react";
import { useUnitStore } from "@store/useUnitsStore";
import { useAppStore } from "@store/useAppStore";

export default function Settings() {
  const forecastCapabilities = useForecastStore.use.forecastCapabilities();
  const userSettings = useForecastStore.use.userSettings();
  const updateSettings = useForecastStore.use.updateSettings();
  const unitsName = useUnitStore.use.names();
  const isOpen = useAppStore.use.isSettingsOpen();
  const toggleSettings = useAppStore.use.toggleSettings();
  
  const [ datas, setDatas ] = useState<mapDataTypes[]>([]);



  useEffect(() => {
    if (!forecastCapabilities || !userSettings.model) return
    setDatas(Object.keys(forecastCapabilities.data[userSettings.model].dataset) as mapDataTypes[])
  }, [forecastCapabilities, userSettings.model])

  return (
    <>
      <button className="burger-btn" id='settings-btn' onClick={toggleSettings}>
        <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
      </button>
      <section className={`settingsContainer ${isOpen ? "active" : ""}`}>
        <a className="about" href="#about">
          <h1 className="h2">XCast</h1>
        </a>
        <article className="datas">
          {datas.map(data => (
            <button onClick={() => {updateSettings({ selected: data })}} className={data === userSettings.selected ? "select-data active" : "select-data"} key={data} >
              {unitsName.get(data)}
            </button>
          ))

          }
        </article>
      </section>
    </>
  )
}
