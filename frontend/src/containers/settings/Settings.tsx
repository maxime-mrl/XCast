import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faWarning,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { useForecastStore } from "@store/useForecastStore";
import { UnitsConfig, useUnitStore } from "@store/useUnitsStore";
import { useAppStore } from "@store/useAppStore";
import { useUserStore } from "@store/useUserStore";
import { ModalContainer, StepSlider } from "@components";
import { mapDataTypes } from "types/customTypes";

import "./Settings.css";

export default function Settings() {
  // get stored data
  const forecastCapabilities = useForecastStore.use.forecastCapabilities();
  const userSettings = useForecastStore.use.userSettings();
  const updateSettings = useForecastStore.use.updateSettings();
  const isOpen = useAppStore.use.isSettingsOpen();
  const toggleSettings = useAppStore.use.toggleSettings();
  const {
    sync,
    toggleSync,
    user,
    setIsLoginOpen,
    setIsRegisterOpen,
    setIsAccountOpen,
  } = useUserStore();
  const unitsStore = useUnitStore();
  const unitsName = unitsStore.names;

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  // close settings modal when click outside
  useEffect(() => {
    if (isOpen) document.addEventListener("click", checkIsClickOutside);
    return () => {
      document.removeEventListener("click", checkIsClickOutside);
    };
    function checkIsClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      // modals and loader are on top so if click is on them do nothing
      for (const doNothingElem of document.querySelectorAll(
        ".modal-container, .loader, .settingsContainer, #settings-btn"
      )) {
        if (doNothingElem.contains(target)) return;
      }
      // close settings modal
      if (isOpen) toggleSettings();
    }
  }, [isOpen, toggleSettings]);

  // get available units in a nice array
  const units: (UnitsConfig & { name: string })[] = [];
  for (const [unit, name] of unitsStore.names.entries()) {
    const unitConfig = unitsStore[unit] as UnitsConfig & { name: string };
    unitConfig["name"] = name;
    units.push(unitConfig);
  }
  // get available data to select
  const datas = forecastCapabilities?.data[userSettings.model]?.dataset
    ? (Object.keys(
        forecastCapabilities.data[userSettings.model].dataset
      ) as mapDataTypes[])
    : [];
  // get available levels for selected data
  const levels = userSettings.selected
    ? forecastCapabilities?.data[userSettings.model].dataset[
        userSettings.selected
      ].levels || []
    : [];

  function resetSettings() {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <>
      <button
        onClick={toggleSettings}
        className={`burger-btn${isOpen ? " active" : ""}`}
        id="settings-btn"
        style={{ display: confirmModalOpen ? "none" : "block" }}
        aria-label="Paramètres"
      >
        <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
      </button>
      <section className={`settingsContainer${isOpen ? " active" : ""}`}>
        <h1 className="settings-title h2 bold">
          <img
            src="/images/logo-512.png"
            alt="Logo XCast"
            className="text-img"
          />
          XCast
        </h1>
        <article className="datas">
          <h2 className="h3 title-divider">Carte</h2>
          {datas.map((data) => (
            <button
              onClick={() => {
                updateSettings({ selected: data });
              }}
              className={`select-data ${
                data === userSettings.selected ? "active" : ""
              }`}
              key={data}
            >
              {unitsName.get(data)}
            </button>
          ))}
        </article>
        <article className="levels">
          <h2 className="h3 title-divider">
            <label htmlFor="level">Altitude</label>
          </h2>
          <p>Sélectionné: {userSettings.level}m</p>
          <StepSlider
            name="level"
            steps={levels.sort((a, b) => a - b)}
            min={Math.min(...levels)}
            max={Math.max(...levels)}
            handleUpdate={(value) => updateSettings({ level: value })}
            unit="m"
            value={userSettings.level || levels[0]}
          />
        </article>
        <article className="models">
          <label className="h3 title-divider" htmlFor={`models-select`}>
            Modèles
          </label>
          <span className="select">
            <select
              name={`models-select`}
              id={`models-select`}
              value={userSettings.model}
              onChange={(e) => updateSettings({ model: e.target.value })}
            >
              {forecastCapabilities?.availableModels.map((model) => (
                <option value={model} key={model}>
                  {model}
                </option>
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
                  onChange={(e) => unit.select(e.target.value)}
                >
                  {Object.keys(unit.units).map((value) => (
                    <option value={value} key={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </span>
            </div>
          ))}
        </article>
        <article className="sync">
          <h2 className="h3 title-divider">Synchronisation</h2>
          <span className="checkbox-container">
            <label htmlFor="settings-sync">
              Activer la synchronisation (nécessite un compte):
            </label>
            <input
              type="checkbox"
              id="settings-sync"
              name="settings-sync"
              checked={sync}
              onChange={toggleSync}
            />
          </span>
          <button
            className="btn margin-center btn-danger"
            onClick={() => setConfirmModalOpen(true)}
          >
            Réinitialiser l'App <FontAwesomeIcon icon={faWarning} />
          </button>
          <ModalContainer
            isOpen={confirmModalOpen}
            setIsOpen={setConfirmModalOpen}
          >
            <p className="text-center">
              Êtes-vous sûr de vouloir réinitialiser l'application ?
            </p>
            <p className="text-center">
              Vous perdrez toutes vos données et vos paramètres, ainsi que vos
              données synchronisées
            </p>
            <div className="gap-1 margin-center">
              <button className="btn btn-danger" onClick={resetSettings}>
                Oui
              </button>
              <button
                className="btn"
                onClick={() => setConfirmModalOpen(false)}
              >
                Non
              </button>
            </div>
          </ModalContainer>
        </article>
        <article className="account text-center">
          <h2 className="h3 title-divider">
            <FontAwesomeIcon icon={faUser} />
            Compte
          </h2>
          {user ? (
            <>
              <p>Content de vous voir {user.username}</p>
              <button
                className="btn margin-center"
                onClick={() => setIsAccountOpen(true)}
              >
                Gérer mon compte
              </button>
            </>
          ) : (
            <>
              <p>Pas encore de compte?</p>
              <button
                className="btn margin-center"
                onClick={() => setIsRegisterOpen(true)}
              >
                S'inscrire
              </button>
              <button
                className="btn margin-center"
                onClick={() => setIsLoginOpen(true)}
              >
                Se connecter
              </button>
            </>
          )}
        </article>
        <article className="about text-center">
          <a
            href="/about"
            target="_blank"
            className="link link-icon margin-center"
            rel="noreferrer"
          >
            A propos de XCast
          </a>
        </article>
      </section>
    </>
  );
}
