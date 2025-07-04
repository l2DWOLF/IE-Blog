import './css/register.css'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { confirmPwField, emailField, nameField, pwField, usernameField } from "../../utils/validations/yupValidations";
import { loginHandler } from "../../auth/services/authService";
import { successMsg } from "../../utils/toastify/toast";
import LoadingScreen from "../common/loadscreen/LoadingScreen";
import FormWrapper from "../common/forms/FormWrapper";
import {FormInput} from "../common/forms/formInput";
import { userRegistration } from '../../services/userServices';
import { handleException } from '../../utils/errors/handleException';


function Register(){
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            confirmPassword: "",
            email: "",
            first_name: "",
            last_name: "",
        },
        validationSchema: yup.object({
            username: usernameField,
            password: pwField,
            confirmPassword: confirmPwField,
            email: emailField,
            first_name: nameField,
            last_name: nameField,
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                delete values.confirmPassword;
                
                await userRegistration(values);
                const loginInfo = {username: values.username, password: values.password};
                
                const token = await loginHandler(loginInfo, dispatch);
                if (token) {
                    successMsg(`Registered Successfully!\n Welcome aboard ${values.username} :)`);
                    navigate("/", { state: { fromLogin: true } });
                }
            } catch (err) {
                handleException(err, { toast: true, alert:true });
            } finally {
                setIsLoading(false);
            };
        }
    });

    return (
        <div className="register-section">
            <div className="mirror-wrapper">
                <h1 className="mirrored" data-text="Register">
                    Register</h1>
            </div>
            
                {isLoading ? (
                <LoadingScreen />
                ) : ( 
                <FormWrapper title="Registration Form" onSubmit={formik.handleSubmit}>
                        
                    <FormInput
                        label="Email" name="email" type="email"
                        formik={formik} placeholder="Enter Email"
                    />
                    <FormInput label="Username" name="username" type="text"
                        formik={formik} placeholder="Enter Username"
                    />
                    <FormInput
                        label="Password" name="password" type="password"
                        formik={formik} placeholder="Enter Password"
                    />
                    <FormInput
                        label="Confirm Password" name="confirmPassword" type="password"
                        formik={formik} placeholder="Validate Password"
                    />
                    <FormInput
                        label="First name" name="first_name" type="text"
                        formik={formik} placeholder="Enter First Name"
                    />
                    <FormInput
                        label="Last name" name="last_name" type="text"
                        formik={formik} placeholder="Enter Last Name"
                    />

                    <button
                        className="submit-btn" type="submit"
                        disabled={!formik.dirty || !formik.isValid || formik.values.password !== formik.values.confirmPassword}
                    >
                        Register
                    </button>
                </FormWrapper>)}
        </div>
    )
}
export default Register
