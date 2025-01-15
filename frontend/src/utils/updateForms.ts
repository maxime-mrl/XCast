
export default function updateForm(e: React.ChangeEvent<HTMLInputElement>, setFormData: React.Dispatch<React.SetStateAction<Record<string, [string, boolean]>>>) {
    let isValidated = false;
    const value = e.target.value;
    const validateQuery = e.target.getAttribute("data-validate");
    // if no validation query, save state and return
    if (!validateQuery) return setFormData(prevState => ({ ...prevState, [e.target.name]: [value, true] }));
    /* ----------------------------- validate inputs ---------------------------- */
    if (!/^&=/.test(validateQuery)) { // normal regex
        const regex = new RegExp(validateQuery, "i");
        if (regex.test(value)) isValidated = true;
    // match other element (confirm password)
    } else if ((document.getElementById(validateQuery.replace("&=", "")) as HTMLInputElement).value === value) isValidated = true;
    /* ------------------------ inform user of validation ----------------------- */
    const parent = e.target.parentNode as HTMLElement;
    if (!isValidated) { // fail
        parent.classList.remove("success");
        parent.classList.add("fail");
    } else { // success
        parent.classList.remove("fail");
        parent.classList.add("success");
    }
    if (value.length === 0) { // no data
        parent.classList.remove("fail");
        parent.classList.remove("success");
    }
    /* ------------------------------ save to state ----------------------------- */
    setFormData(prevState => ({
        ...prevState,
        [e.target.name]: [e.target.value, isValidated]
    }));
  }