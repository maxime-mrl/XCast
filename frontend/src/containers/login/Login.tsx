import { useState } from "react";
import updateForm from "@utils/updateForms";
import { useUserStore } from "@store/useUserStore";
import { ModalContainer, TextInput } from "@components";
import "./Login.css";

export default function Login() {
  const {
    isLoginOpen: isOpen,
    setIsLoginOpen: setIsOpen,
    setIsRegisterOpen,
    login,
  } = useUserStore();

  const [{ login_mail: mail, login_password: password }, setFormData] =
    useState<{ [key: string]: [string, boolean] }>({
      login_mail: ["", false],
      login_password: ["", false],
    });

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateForm(e, setFormData);

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!mail[1] || !password[1]) {
      return;
    }
    login({
      mail: mail[0],
      password: password[0],
    });
  }

  return (
    <ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
      <form onSubmit={submitForm} className="login-form">
        <h2 className="h2">Se connecter</h2>
        <TextInput
          label={{
            regular: "E-mail:",
            error: "E-mail invalide",
          }}
          input={{
            name: "login_mail",
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
            name: "login_password",
            placeholder: "Ton mot de passe",
            type: "password",
          }}
          validation={"^.{6,}$"}
          valueState={password[0]}
          updateForm={handleUpdate}
        />
        <button type="submit" className="btn btn-accent">
          Se connecter
        </button>
        <div className="login-redirect">
          Pas encore de compte?{" "}
          <button className="link" onClick={() => setIsRegisterOpen(true)}>
            S'inscrire
          </button>
        </div>
      </form>
    </ModalContainer>
  );
}
