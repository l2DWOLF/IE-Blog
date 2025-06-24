import "./css/login.css";
import { useState } from "react";
import {useNavigate} from 'react-router-dom';
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { pwField, usernameField } from "../../utils/validations/yupValidations";
import { loginHandler } from "../../auth/services/authService";
import { successMsg } from "../../utils/toastify/toast";
import LoadingScreen from "../common/loadscreen/LoadingScreen";


function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: yup.object({
            username: usernameField,
            password: pwField
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const token = await loginHandler(values, dispatch);
                if (token) {
                    successMsg(`Logged in Successfully!\n Welcome back ${values.username}`);
                    navigate("/", {state: {fromLogin: true}});
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            };
        } 
    });

    return (
        <div className="login-section">
            <h1>Login</h1>
            
            <div className="form-container">
                <h3>Login Form</h3>

                {isLoading ? (
                    <LoadingScreen />
                ) : (
                <form className="login-form" onSubmit={formik.handleSubmit}>
                    <div className="input-field">
                        <label htmlFor="username">*Username:</label>
                        <input type="username" name="username" id="username" autoComplete="on" placeholder="Enter Username" value={formik.values.username} onBlur={formik.handleBlur} onChange={formik.handleChange} />
                        {formik.touched.username && formik.errors.username && (<p className="input-error-msg">
                            {formik.errors.username}
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
                    </form>)}
            </div>
        </div>)}
export default Login;