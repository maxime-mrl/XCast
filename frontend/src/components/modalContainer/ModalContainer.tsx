import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import "./ModalContainer.css";

// Modal container for modals
export default function ModalContainer({
  children,
  isOpen,
  setIsOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  // close modal when clicking outside
  function handleModalClick(e: React.MouseEvent<HTMLDivElement>) {
    if (
      e.target &&
      "className" in e.target &&
      e.target.className === "modal-container"
    ) {
      setIsOpen(false);
    }
  }
  // return children content wrapped in modal
  return (
    <div
      className="modal-container"
      style={{ display: isOpen ? "flex" : "none" }}
      onClick={handleModalClick}
    >
      <button
        onClick={() => setIsOpen(false)}
        className={`burger-btn`}
        id="modal-btn"
        aria-label="Fermer"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
      <div className="modal-content">{children}</div>
    </div>
  );
}
