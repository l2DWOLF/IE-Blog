import './css/forms.css'

export function FormInput({formik, label, name, type = "text", 
                placeholder = "", required=false, className=""}){
    return(
        <div className={`input-field ${className}`}>
            <label htmlFor={name}>{label}</label>
            {formik.touched[name] && formik.errors[name] && (
                <p className="input-error-msg">
                    {formik.errors[name]}
                </p>
            )}

            {type === "textarea" ? (
                <textarea name={name} id={name} value={formik.values[name]} required={required}
                onChange={formik.handleChange} onBlur={formik.handleBlur} rows={10}
                placeholder={placeholder} className="form-textarea"
                > 

                </textarea>
            ) : (
                <input
                    type={type} id={name} name={name} autoComplete="on"
                    value={formik.values[name]} onChange={formik.handleChange}
                    onBlur={formik.handleBlur} placeholder={placeholder} required={required}
                />
            )}
            
        </div>
    );
};

export function FormSelectInput({formik, label, name,
    options=[], required=true, multipleAllowed="false"}){
    
    const handleChange = (e) =>{
        const value = e.target.value;
        const selectedValues = multipleAllowed === "true" ? Array.from(e.target.selectedOptions, (option) => option.value) : value;
        formik.setFieldValue(name, selectedValues, false);
        formik.setTouched({ ...formik.touched, [name]: true }, true);
        setTimeout(() => {
            formik.validateField(name);
        }, 0);
    };

    return(
    <div className="input-field">
        <label htmlFor={name}>{label}</label>
        {formik.touched[name] && formik.errors[name] && (
            <p className="input-error-msg">
                {formik.errors[name]}
            </p>
        )}
        <select multiple={multipleAllowed === "true"} name={name} id={name} 
                required={required} value={formik.values[name]} 
                onChange={handleChange}
        >
            {options.map((option) => (
                <option key={option} value={option}>{option}</option>
            ))
            }
        </select>
    </div>
    ); 
};