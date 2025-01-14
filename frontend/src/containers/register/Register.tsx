import { useState } from 'react';
import ModalContainer from 'src/components/modalContainer/ModalContainer';
import updateForm from '@utils/updateForms';
import TextInput from 'src/components/textInput/TextInput';
import { useUserStore } from '@store/useUserStore';
import './Register.css';

export default function Register() {
  const { isRegisterOpen:isOpen, setIsRegisterOpen:setIsOpen, setIsLoginOpen, register } = useUserStore();

  const [{ username, mail, password, confirm_password }, setFormData] = useState<{ [key: string]: [string, boolean]; }>({
    username: ["", false],
    mail: ["", false],
    password: ["", false],
    confirm_password: ["", false],
  });

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => updateForm(e, setFormData); 

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!username[1] || !mail[1] || !password[1] || !confirm_password[1]) {
        // toast.error("Please fill and validate all inputs!");
        return;
    }
    register({
      username: username[0],
      mail: mail[0],
      password: password[0],
    });
  }

  return (
    <ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
    <form onSubmit={submitForm} className="register-form">
        <h2 className="h2">S'inscrire</h2>
        <TextInput 
            label={{
                regular: "Nom d'utilisateur:",
                error: "Nom d'utilisateur invalide, charactères autorisés: a-z, 0-9, - et _"
            }}
            input={{
                name: "username",
                placeholder: "Ton nom d'utilisateur",
                autoComplete: "username",
            }}
            validation={"^[-_a-z0-9]{3,}$"}
            valueState={username[0]}
            updateForm={handleUpdate}
        />
        <TextInput 
            label={{
                regular: "E-mail:",
                error: "E-mail invalide"
            }}
            input={{
                name: "mail",
                placeholder: "Ton e-mail",
                autoComplete: "email",
                type: "email"
            }}
            validation={"^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"}
            valueState={mail[0]}
            updateForm={handleUpdate}
        />
        <TextInput 
            label={{
                regular: "Mot de passe:",
                error: "Ton mot de passe doit faire au moins 6 caractères"
            }}
            input={{
                name: "password",
                placeholder: "Ton mot de passe",
                type: "password"
            }}
            validation={"^.{6,}$"}
            valueState={password[0]}
            updateForm={handleUpdate}
        />
        <TextInput 
            label={{
                regular: "Confirmer le mot de passe:",
                error: "Ton mot de passe ne correspond pas"
            }}
            input={{
                name: "confirm_password",
                placeholder: "Ton mot de passe",
                type: "password"
            }}
            validation={"&=password"}
            valueState={confirm_password[0]}
            updateForm={handleUpdate}
        />
        <button type="submit" className="btn btn-accent">S'inscrire</button>
        <div className="login-redirect">
          Déjà un compte? <button className='link' onClick={() => setIsLoginOpen(true)}>Se connecter</button>
        </div>
    </form>
    </ModalContainer>
  )
}