import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faWarning, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useForecastStore } from "@store/useForecastStore";
import { UnitsConfig, useUnitStore } from "@store/useUnitsStore";
import { useAppStore } from "@store/useAppStore";
import { StepSlider } from "@components";
import './Settings.css';
import ModalContainer from "src/components/modalContainer/ModalContainer";
import { useState } from "react";

export default function Settings() {
  // get stored data
  const forecastCapabilities = useForecastStore.use.forecastCapabilities();
  const userSettings = useForecastStore.use.userSettings();
  const updateSettings = useForecastStore.use.updateSettings();
  const unitsName = useUnitStore.use.names();
  const isOpen = useAppStore.use.isSettingsOpen();
  const toggleSettings = useAppStore.use.toggleSettings();
  const sync = useAppStore.use.sync();
  const toggleSync = useAppStore.use.toggleSync();
  const unitsStore = useUnitStore();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // get available units in a nice array
  const units: (UnitsConfig & { name: string })[] = [];
  for (const [unit, name] of unitsStore.names.entries()) {
    const unitConfig = unitsStore[unit] as UnitsConfig & { name: string };
    unitConfig["name"] = name;
    units.push(unitConfig);
  };
  // get available data to select
  const datas = forecastCapabilities?.data[userSettings.model]?.dataset
    ? (Object.keys(forecastCapabilities.data[userSettings.model].dataset) as mapDataTypes[])
    : [];
  // get available levels for selected data
  const levels = forecastCapabilities?.data[userSettings.model].dataset[userSettings.selected].levels || [];

  function resetSettings() {
    localStorage.clear();
    window.location.reload();
    // should have a reset for user account if synced
    // will be made latter when user account actually exists
  }

  return (
    <>
      <button onClick={toggleSettings} className={`burger-btn${isOpen ? " active" : ""}`} id='settings-btn' style={{display: confirmModalOpen ? "none" : "block"}}>
        <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
      </button>
      <section className={`settingsContainer${isOpen ? " active" : ""}`}>
        <h1 className="settings-title h2 bold">
          <img src="/images/logo-512.png" alt="Logo XCCast" className="text-img" />
          XCast
        </h1>
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
        <article className="sync">
          <h2 className="h3 title-divider">Synchronisation</h2>
          <span className="checkbox-container">
            <label htmlFor="settings-sync">Activer la synchronisation (nécessite un compte):</label>
            <input type="checkbox" id="settings-sync" name="settings-sync" checked={sync} onChange={toggleSync}/>
          </span>
          <button className="btn margin-center" onClick={() => setConfirmModalOpen(true)}>Réinitialiser l'App <FontAwesomeIcon icon={faWarning} /></button>
          <ModalContainer isOpen={confirmModalOpen} setIsOpen={setConfirmModalOpen}>
            <p>Êtes-vous sûr de vouloir réinitialiser l'application ?</p>
            <button className="btn margin-center" onClick={resetSettings}>Oui</button>
          </ModalContainer>
        </article>
        <article className="about text-center">
          <a href="/about" target="_blank" className="link link-icon margin-center" rel="noreferrer">A propos de XCcast</a>
        </article>
      </section>
    </>
  )
}
