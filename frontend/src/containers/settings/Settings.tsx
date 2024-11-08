import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDataContext } from "@context";
import { useMapStore } from "@store/useMapStore";

import './Settings.css'
import { useEffect, useState } from "react";
import { useUnitStore } from "@store/useUnitsStore";

export default function Settings() {
  const { settings:[isOpen, setIsOpen] } = useDataContext();
  
  const toggleSettings = () => setIsOpen(prevState => !prevState);
  const [ datas, setDatas ] = useState<string[]>([]);

  const mapCapabilities = useMapStore.use.mapCapabilities();
  const userSettings = useMapStore.use.userSettings();
  const updateSettings = useMapStore.use.updateSettings();
  const unitsName = useUnitStore.use.names();

  useEffect(() => {
    if (!mapCapabilities || !userSettings.model) return
    setDatas(Object.keys(mapCapabilities.data[userSettings.model].dataset))
  }, [mapCapabilities, userSettings.model])

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
