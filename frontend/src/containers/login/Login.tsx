import ModalContainer from 'src/components/modalContainer/ModalContainer';
import { useAppStore } from '@store/useAppStore';
import './Login.css';

export default function Login() {
  const isOpen = useAppStore.use.isLoginOpen();
  const setIsOpen = useAppStore.use.setIsLoginOpen();
  
  return (
    <ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className='login'>
        <h2 className="h2 bold">Login</h2>
        <form>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </ModalContainer>
  )
}