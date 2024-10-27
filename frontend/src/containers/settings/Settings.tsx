import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDataContext } from "../../context/DataContext";

import './Settings.css'

export default function Settings() {
  const { settings:[isOpen, setIsOpen] } = useDataContext();
  
  const toggleSettings = () => setIsOpen((prevState: Boolean) => !prevState)

  return (
    <>
      <button className="burger-btn" id='settings-btn' onClick={toggleSettings}>
        <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
      </button>
      <div className={`settingsContainer ${isOpen ? "active" : ""}`}>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestiae sint exercitationem perspiciatis iusto ea voluptas, placeat recusandae officiis nulla aliquam ab fugit facere et voluptatem! Perferendis neque repellat amet recusandae.
      </div>
    </>
  )
}
