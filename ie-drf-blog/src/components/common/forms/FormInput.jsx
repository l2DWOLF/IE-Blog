import './css/forms.css'

function FormInput({label, name, type = "text", formik, placeholder = ""}){
    return(
        <div className="input-field">
            <label htmlFor={name}>{label}</label>
            {formik.touched[name] && formik.errors[name] && (
                <p className="input-error-msg">
                    {formik.errors[name]}
                </p>
            )}
            <input 
                type={type} id={name} name={name} autoComplete="on"
                value={formik.values[name]} onChange={formik.handleChange}
                onBlur={formik.handleBlur} placeholder={placeholder}
            />
        </div>
    );
}
export default FormInput