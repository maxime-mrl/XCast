import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useForecastStore } from "@store/useForecastStore";
import { UnitsConfig, useUnitStore } from "@store/useUnitsStore";
import { useAppStore } from "@store/useAppStore";
import { StepSlider } from "@components";
import './Settings.css';

export default function Settings() {
  // get stored data
  const forecastCapabilities = useForecastStore.use.forecastCapabilities();
  const userSettings = useForecastStore.use.userSettings();
  const updateSettings = useForecastStore.use.updateSettings();
  const unitsName = useUnitStore.use.names();
  const isOpen = useAppStore.use.isSettingsOpen();
  const toggleSettings = useAppStore.use.toggleSettings();
  const unitsStore = useUnitStore();
  const units: (UnitsConfig & { name: string })[] = [];
  for (const [unit, name] of unitsStore.names.entries()) {
    const unitConfig = unitsStore[unit] as UnitsConfig & { name: string };
    unitConfig["name"] = name;
    units.push(unitConfig)
  };

  
  // get available data to select
  const datas = forecastCapabilities?.data[userSettings.model]?.dataset
    ? (Object.keys(forecastCapabilities.data[userSettings.model].dataset) as mapDataTypes[])
    : [];
  // get available levels for selected data
  const levels = forecastCapabilities?.data[userSettings.model].dataset[userSettings.selected].levels || [];

  return (
    <>
      <button onClick={toggleSettings} className="burger-btn" id='settings-btn'>
        <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
      </button>
      <section className={`settingsContainer${isOpen ? " active" : ""}`}>
        <a className="about" href="#about">
          <h1 className="h2">XCast</h1>
        </a>
        <article className="datas">
          <h2 className="h3 title-divider">Carte</h2>
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
        <article className="levels">
          <h2 className="h3 title-divider">Altitude</h2>
          <p>Sélectionné: {userSettings.level}m</p>
          <StepSlider
            steps={levels.sort((a,b) => a - b)}
            min={Math.min(...levels)}
            max={Math.max(...levels)}
            handleUpdate={value => updateSettings({level: value})}
            unit="m"
            value={userSettings.level || levels[0]}
          />
        </article>
        <article className="models">
          <label className="h3 title-divider" htmlFor={`models-select`}>Modèles</label>
          <span className="select">
            <select
              name={`models-select`}
              id={`models-select`}
              value={userSettings.model}
              onChange={e => updateSettings({model: e.target.value})}
            >
              {forecastCapabilities?.availableModels.map(model => (
                <option value={model} key={model}>{model}</option>
              ))}
            </select>
          </span>
        </article>
        <article className="units">
          <h2 className="h3 title-divider">Unités</h2>
          {units.map((unit) => (
          <div key={unit.name}>
            <label htmlFor={`unit-select-${unit.name}`}>{unit.name}:</label>
            <span className="select">
              <select
                name={`unit-select-${unit.name}`}
                id={`unit-select-${unit.name}`}
                value={unit.selected}
                onChange={e => unit.select(e.target.value)}
              >
                {Object.keys(unit.units).map(value => (
                  <option value={value} key={value}>{value}</option>
                ))}
              </select>
            </span>
          </div>
          ))}
        </article>
      </section>
    </>
  )
}
