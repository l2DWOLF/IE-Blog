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
import FormWrapper from "../common/forms/FormWrapper";
import {FormInput} from "../common/forms/formInput";
import { handleException } from "../../utils/errors/handleException";


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
                    successMsg(`Logged in Successfully!\n Welcome back ${values.username}! :)`);
                    navigate("/", {state: {fromLogin: true}});
                }
            } catch (err) {
                handleException(err, { toast: true, alert:true });
            } finally {
                setIsLoading(false);
            };
        } 
    });

    return (
        <div className="login-section">
            <div className="mirror-wrapper">
                <h1 className="mirrored" data-text="Login">
                    Login</h1>
            </div>
            
                {isLoading ? (
                <LoadingScreen />
                ) : ( 
                <FormWrapper title="Login Form" onSubmit={formik.handleSubmit}>
                    <FormInput label="Username" name="username"
                        formik={formik} placeholder="Enter Username"
                    />
                    <FormInput
                        label="Password" name="password" type="password"
                        formik={formik} placeholder="Enter Password"
                    />

                    <button
                        className="submit-btn" type="submit"
                        disabled={!formik.dirty || !formik.isValid}
                    >
                        Login
                    </button>
                </FormWrapper>)}
            </div>
        )}
export default Login; 