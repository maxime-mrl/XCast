import { useState } from "react";
import { toast } from "react-toastify";

import { useUserStore } from "@store/useUserStore";
import { checkEntries, formState, updateForm } from "@utils/updateForms";
import { ModalContainer, TextInput } from "@components";

import "./Account.css";

export default function Account() {
  // get user
  const {
    user,
    isAccountOpen: isOpen,
    setIsAccountOpen: setIsOpen,
    logout,
    deleteAccount,
    updateAccount,
  } = useUserStore();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  // form state
  const [
    { new_username, new_mail, new_password, confirm_password },
    setFormData,
  ] = useState<formState>({
    new_username: ["", false],
    new_mail: ["", false],
    new_password: ["", false],
    confirm_password: ["", false],
  });

  // handle form actions
  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateForm(e, setFormData);

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      !checkEntries({
        required: { confirm_password },
        optionnal: { new_username, new_mail, new_password },
      })
    )
      return;
    updateAccount({
      username: new_username[0] ? new_username[0] : undefined,
      mail: new_mail[0] ? new_mail[0] : undefined,
      password: new_password[0] ? new_password[0] : undefined,
      confirmPassword: confirm_password[0],
    });
  }

  // ask a confirmation before deleting the account
  function confirmDelete() {
    if (!confirm_password[1])
      return toast.error(
        "Veuillez entrer votre mot de passe pour supprimer le compte"
      );
    setConfirmModalOpen(true);
  }

  if (!user || !user._id) return null;

  return (
    <>
      {/* update account part */}
      <ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
        <h2 className="h1 full-width text-center">Bonjour {user.username}</h2>
        <form onSubmit={submitForm} className="account-form">
          <h3 className="h2">Modifier le compte</h3>
          <TextInput
            label={{
              regular: "Nouveau nom d'utilisateur:",
              error:
                "Nom d'utilisateur invalide, charactères autorisés: a-z, 0-9, - et _",
            }}
            input={{
              name: "new_username",
              placeholder: "Ton nom d'utilisateur",
              autoComplete: "username",
            }}
            validation={"^[-_a-z0-9]{3,}$"}
            valueState={new_username[0]}
            updateForm={handleUpdate}
          />
          <TextInput
            label={{
              regular: "Changer d'e-mail:",
              error: "E-mail invalide",
            }}
            input={{
              name: "new_mail",
              placeholder: "Ton e-mail",
              autoComplete: "email",
              type: "email",
            }}
            validation={"^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"}
            valueState={new_mail[0]}
            updateForm={handleUpdate}
          />
          <TextInput
            label={{
              regular: "Nouveau mot de passe:",
              error: "Ton mot de passe doit faire au moins 6 caractères",
            }}
            input={{
              name: "register_password",
              placeholder: "Ton mot de passe",
              type: "password",
            }}
            validation={"^.{6,}$"}
            valueState={new_password[0]}
            updateForm={handleUpdate}
          />
          <TextInput
            label={{
              regular: "Votre mot de passe actuel:",
              error: "Ton mot de passe ne correspond pas",
            }}
            input={{
              name: "confirm_password",
              placeholder: "Ton mot de passe",
              type: "password",
            }}
            validation={"^.{6,}$"}
            valueState={confirm_password[0]}
            updateForm={handleUpdate}
          />
          <div className="btns">
            <button className="btn btn-danger" onClick={() => logout()}>
              Se déconnecter
            </button>
            <button className="btn btn-danger" onClick={confirmDelete}>
              Supprimer le compte
            </button>
            <button type="submit" className="btn btn-accent">
              Modifier le compte
            </button>
          </div>
        </form>
      </ModalContainer>
      {/* confirmation modal */}
      <ModalContainer isOpen={confirmModalOpen} setIsOpen={setConfirmModalOpen}>
        <p className="text-center">
          Êtes-vous sûr de vouloir supprimer votre compte ?
        </p>
        <p className="text-center">
          Cette action est irréversible, toutes vos données seront perdues.
        </p>
        <div className="gap-1 margin-center">
          <button
            className="btn btn-danger"
            onClick={() => deleteAccount(confirm_password[0])}
          >
            Oui
          </button>
          <button className="btn" onClick={() => setConfirmModalOpen(false)}>
            Non
          </button>
        </div>
      </ModalContainer>
    </>
  );
}
