import "./css/login.css"
import { useFormik } from "formik";
import * as yup from "yup"
import { emailField, pwField } from "../../utils/validations/yupValidations";

function Login(){

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: yup.object({
            email: emailField,
            password: pwField
        }),
        onSubmit: async (values) => {
            try{
                const token = await loginHandler(values, dispatch);
                if(token){
                    console.log("token here: ", token);
                }
            } catch (err) {
                console.error(err);
            };
        }
    });

    return(
        <div className="login-section">
        <h1>Login</h1>    

        <div className="form-container">
            <h3>Login Form</h3>
            <form className="login-form" onSubmit={formik.handleSubmit}>
                <div className="input-field">
                    <label htmlFor="email">*Email:</label>
                    <input type="email" name="email" id="email" autoComplete="on" placeholder="Enter Email" value={formik.values.email} onBlur={formik.handleBlur} onChange={formik.handleChange} />
                    {formik.touched.email && formik.errors.email && (<p className="input-error-msg">
                        {formik.errors.email}
                    </p>)}
                </div>

                <div className="input-field">
                    <label htmlFor="password">*Password:</label>
                    <input type="password" name="password" id="password" autoComplete="on" placeholder="Enter Password" value={formik.values.password} onBlur={formik.handleBlur} onChange={formik.handleChange} />
                    {formik.touched.password && formik.errors.password && (<p className="input-error-msg">
                        {formik.errors.password}
                    </p>)}
                </div>
                <button className="submit-btn" type="submit" disabled={!formik.dirty || !formik.isValid}>Login</button>
            </form>
        </div>
    </div>)
}
export default Login;