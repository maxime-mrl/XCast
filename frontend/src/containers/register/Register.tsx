import ModalContainer from 'src/components/modalContainer/ModalContainer';
import { useAppStore } from '@store/useAppStore';
import './Register.css';

export default function Register() {
  const isOpen = useAppStore.use.isRegisterOpen();
  const setIsOpen = useAppStore.use.setIsRegisterOpen();

  return (
    <ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className='register'>
        <h2 className="h2 bold">Register</h2>
        <form>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
          </div>
          <div className="input-group">
            <label htmlFor="password-confirm">Confirm Password</label>
            <input type="password" id="password-confirm" name="password-confirm" />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </ModalContainer>
  )
}