import { toast } from "react-toastify";

export type formState = Record<string, [string, boolean]>; // form state type

// update form data and validate it
export function updateForm(
  e: React.ChangeEvent<HTMLInputElement>,
  setFormData: React.Dispatch<React.SetStateAction<formState>>
) {
  let isValidated = false;
  const value = e.target.value;
  console.log(e.target.name);
  const validateQuery = e.target.getAttribute("data-validate");
  // if no validation query, save state and return
  if (!validateQuery)
    return setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: [value, true],
    }));
  /* ----------------------------- validate inputs ---------------------------- */
  if (!/^&=/.test(validateQuery)) {
    // normal regex
    const regex = new RegExp(validateQuery, "i");
    if (regex.test(value)) isValidated = true;
    // match other element (confirm password)
  } else if (
    (
      document.getElementById(
        validateQuery.replace("&=", "")
      ) as HTMLInputElement
    ).value === value
  )
    isValidated = true;
  /* ------------------------ inform user of validation ----------------------- */
  const parent = e.target.parentNode as HTMLElement;
  if (!isValidated) {
    // fail
    parent.classList.remove("success");
    parent.classList.add("fail");
  } else {
    // success
    parent.classList.remove("fail");
    parent.classList.add("success");
  }
  if (value.length === 0) {
    // no data
    parent.classList.remove("fail");
    parent.classList.remove("success");
  }
  /* ------------------------------ save to state ----------------------------- */
  setFormData((prevState) => ({
    ...prevState,
    [e.target.name]: [value, isValidated],
  }));
}

// check if all fields are filled the way they should be
export function checkEntries(form: {
  optionnal?: Record<string, [string, boolean]>; // optional fields
  required: Record<string, [string, boolean]>; // required fields
}) {
  const errMessage = "Veuillez remplir et valider tous les champs obligatoires";
  for (const field in form.required) {
    // all required fields must be validated
    if (!form.required[field][1]) {
      toast.error(errMessage);
      return false;
    }
  }
  for (const field in form.optionnal) {
    // if optional field is filled, it must be validated
    if (!form.optionnal[field][1] && form.optionnal[field][0].length > 0) {
      toast.error(errMessage);
      return false;
    }
  }
  return true;
}
