import { useEffect } from "react";


export function FormTagSelector({formik, label, name, options = []}){
const selectedTags = formik.values[name] ?? [];

const handleToggle = (tag) => {
    const isSelected = selectedTags.includes(tag);
    const updatedTags = isSelected ? selectedTags.filter((t) => t !== tag)
                        : [...selectedTags, tag]; 
    formik.setFieldValue(name, updatedTags, false);
    formik.setTouched({ ...formik.touched, [name]: true }, true);
    setTimeout(() => {
        formik.validateField(name);
    }, 0);
}; 

    
return ( <div className="tags-container">
    <h5>{label}</h5>
    <div className="tags-div">
        {options.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
                <div
                    key={tag}
                    className={`article-tag ${isSelected ? "selected" : ""}`}
                    onClick={() => handleToggle(tag)}
                    role="button"
                >
                    <p>{tag}</p>
                </div>
            );
        })}
    </div>
    {formik.touched[name] && formik.errors[name] && (
        <p className="input-error-msg">{formik.errors[name]}</p>
    )}
    </div>
    )
}