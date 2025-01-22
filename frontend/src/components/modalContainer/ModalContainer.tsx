import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ModalContainer.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function ModalContainer({
  children,
  isOpen,
  setIsOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  function handleModalClick(e: React.MouseEvent<HTMLDivElement>) {
    if (
      e.target &&
      "className" in e.target &&
      e.target.className === "modal-container"
    ) {
      setIsOpen(false);
    }
  }

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
