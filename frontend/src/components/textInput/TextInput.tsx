import "./TextInput.css";

type inputProps = {
    label: {  regular: string, error: string },
    input: { type?: string, name: string, placeholder?: string, autoComplete?: string },
    validation: string,
    updateForm: (e: React.ChangeEvent<HTMLInputElement>) => void,
    valueState: string
}

export default function TextInput({ label, input, validation, updateForm, valueState }: inputProps) {
    return (
        <div className="text-input-container">
            <input
                className="text-input"
                type={input.type ? input.type : "text"}
                name={input.name}
                id={input.name}
                placeholder={input.placeholder}
                autoComplete={input.autoComplete}
                data-validate={validation}
                value={valueState}
                onChange={updateForm}
            />
            <label htmlFor={input.name} className="text-label">
                <div className="regular">{label.regular}</div>
                <div className="error">{label.error}</div>
            </label>
        </div>
    )
}
