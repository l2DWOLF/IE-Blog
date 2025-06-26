import './css/forms.css'

function FormWrapper({title, children, onSubmit}){
    return (
        <div className="form-container">
            {title && <h3>{title}</h3>}
            <form className="custom-form" onSubmit={onSubmit}>
                {children}
            </form>
        </div>
    );
}
export default FormWrapper