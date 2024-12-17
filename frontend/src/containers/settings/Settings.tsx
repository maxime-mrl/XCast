import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useForecastStore } from "@store/useForecastStore";
import { useUnitStore } from "@store/useUnitsStore";
import { useAppStore } from "@store/useAppStore";
import './Settings.css';

export default function Settings() {
  // get stored data
  const forecastCapabilities = useForecastStore.use.forecastCapabilities();
  const userSettings = useForecastStore.use.userSettings();
  const updateSettings = useForecastStore.use.updateSettings();
  const unitsName = useUnitStore.use.names();
  const isOpen = useAppStore.use.isSettingsOpen();
  const toggleSettings = useAppStore.use.toggleSettings();
  
  // get available data to select
  const datas = forecastCapabilities?.data[userSettings.model]?.dataset
    ? (Object.keys(forecastCapabilities.data[userSettings.model].dataset) as mapDataTypes[])
    : [];

  return (
    <>
      <button onClick={toggleSettings} className="burger-btn" id='settings-btn'>
        <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
      </button>
      <section className={`settingsContainer ${isOpen ? "active" : ""}`}>
        <a className="about" href="#about">
          <h1 className="h2">XCast</h1>
        </a>
        <article className="datas">
          {datas.map(data => (
            <button
              onClick={() => {updateSettings({ selected: data })}}
              className={`select-data ${data === userSettings.selected ? "active" : ""}`}
              key={data}
            >
              {unitsName.get(data)}
            </button>
          ))

          }
        </article>
      </section>
    </>
  )
}
