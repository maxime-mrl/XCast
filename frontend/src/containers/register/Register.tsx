import { useState } from "react";

import { checkEntries, formState, updateForm } from "@utils/updateForms";
import { useUserStore } from "@store/useUserStore";
import { ModalContainer, TextInput } from "@components";

import "./Register.css";

export default function Register() {
  // get user
  const {
    isRegisterOpen: isOpen,
    setIsRegisterOpen: setIsOpen,
    setIsLoginOpen,
    register,
  } = useUserStore();

  // form state
  const [
    {
      register_username: username,
      register_mail: mail,
      register_password: password,
      register_confirm_password: confirm_password,
    },
    setFormData,
  ] = useState<formState>({
    register_username: ["", false],
    register_mail: ["", false],
    register_password: ["", false],
    register_confirm_password: ["", false],
  });

  // handle form actions
  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateForm(e, setFormData);

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      !checkEntries({
        required: { username, mail, password, confirm_password },
      })
    )
      return;
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
            error:
              "Nom d'utilisateur invalide, charactères autorisés: a-z, 0-9, - et _",
          }}
          input={{
            name: "register_username",
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
            error: "E-mail invalide",
          }}
          input={{
            name: "register_mail",
            placeholder: "Ton e-mail",
            autoComplete: "email",
            type: "email",
          }}
          validation={"^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"}
          valueState={mail[0]}
          updateForm={handleUpdate}
        />
        <TextInput
          label={{
            regular: "Mot de passe:",
            error: "Ton mot de passe doit faire au moins 6 caractères",
          }}
          input={{
            name: "register_password",
            placeholder: "Ton mot de passe",
            type: "password",
          }}
          validation={"^.{6,}$"}
          valueState={password[0]}
          updateForm={handleUpdate}
        />
        <TextInput
          label={{
            regular: "Confirmer le mot de passe:",
            error: "Ton mot de passe ne correspond pas",
          }}
          input={{
            name: "register_confirm_password",
            placeholder: "Ton mot de passe",
            type: "password",
          }}
          validation={"&=password"}
          valueState={confirm_password[0]}
          updateForm={handleUpdate}
        />
        <button type="submit" className="btn btn-accent">
          S'inscrire
        </button>
        <div className="login-redirect">
          Déjà un compte?{" "}
          <button className="link" onClick={() => setIsLoginOpen(true)}>
            Se connecter
          </button>
        </div>
      </form>
    </ModalContainer>
  );
}
