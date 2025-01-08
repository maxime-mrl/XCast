import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ModalContainer.css';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ModalContainer({ children, isOpen, setIsOpen }: { children: React.ReactNode, isOpen: boolean, setIsOpen: (isOpen:boolean) => void }) {
  return (
    <div className='modal-container' style={{ display: isOpen ? 'flex' : 'none' }}>
      <button onClick={() => setIsOpen(false)} className={`burger-btn`} id='modal-btn'>
        <FontAwesomeIcon icon={faXmark} />
      </button>
      <div className="modal-content">
        {children}
      </div>
    </div>
  )
}
