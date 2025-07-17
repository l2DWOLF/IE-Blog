import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from "formik";
import * as yup from "yup";
import { successMsg, warningMsg } from "../../../utils/toastify/toast";
import LoadingScreen from "../../common/loadscreen/LoadingScreen";
import FormWrapper from "../../common/forms/FormWrapper";
import { FormInput } from "../../common/forms/formInput";
import { handleException } from '../../../utils/errors/handleException';
import useAuth from '../../../auth/hooks/useAuth';
import { bioField, dateField, emailField, nameField, updatePwField } from '../../../utils/validations/yupValidations';
import { updateUserProfile } from '../../../services/userServices';


function EditProfileForm( {userInfo, userProfile, refetch, onCancel} ) {
    const {user} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [initialValues, setInitialValues] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadForm = async () => {
            try {
                setIsLoading(true);
                if(!user?.username){
                    warningMsg("You don't have permissions to edit this article, you may only edit/delete your own articles - redirecting to homepage.");
                    setIsLoading(false);
                    navigate('/');
                }
                else {
                    setShowContent(true);
                    console.log("user Info: ", userInfo);
                    console.log("userProfile: ", userProfile);
                    setInitialValues({
                        email: userInfo?.email || "",
                        password: "",
                        first_name: userInfo?.first_name || "",
                        last_name: userInfo?.last_name || "",
                        location: userProfile?.location || "",
                        bio: userProfile?.bio || "",
                        birth_date: userProfile?.birth_date || "",
                    });
                };
            } catch (err) {
                handleException(err, { toast: true, alert: true})
            } finally {
                setIsLoading(false);
            }  
        };
        loadForm();
    }, [user.id])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues || {
            email: "",
            password: "",
            first_name: "",
            last_name: "",
            location: "",
            birth_date: userProfile?.birth_date
                ? new Date(userProfile.birth_date).toISOString().split("T")[0]
            : "",
            bio: "",
        },
        validationSchema: yup.object({
            email: emailField,
            password: updatePwField,
            first_name: nameField,
            last_name: nameField,
            location: yup.string().min(2).max(50),
            birth_date: dateField,
            bio: bioField,
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const payload = {
                    user: {
                        email: values.email,
                        password: values.password,
                        first_name: values.first_name,
                        last_name: values.last_name,

                    },
                    userprofile: {
                        bio: values.bio,
                        location: values.location,
                        birth_date: values.birth_date
                            ? new Date(values.birth_date).toISOString().split("T")[0]
                        : null,
                    },
                }
                Object.keys(payload.user).forEach((key) => {
                    if (payload.user[key] === "") {
                        delete payload.user[key];
                    }
                });
                Object.keys(payload.userprofile).forEach((key) => {
                    if (payload.user[key] === "") {
                        delete payload.user[key];
                    }
                });

                await updateUserProfile(payload);
                successMsg("Profile Updated Succesfully! :)")
                onCancel();
                await refetch();
            } catch (err) {
                handleException(err, { toast: true, alert: true });
            } finally {
                setIsLoading(false);
            };
        }
    });

    return (<>
            {isLoading || !showContent ? (
                <LoadingScreen />
            ) : (
                <FormWrapper className="edit-profile-form" title="Edit Profile" onSubmit={formik.handleSubmit}>
                    <button className="close-btn" type="button" onClick={onCancel}>X</button>
                    
                    <FormInput label="Email" name="email" type="email" 
                        formik={formik} placeholder="enter email" />

                    <FormInput label="change password" name="password" type="password"
                        formik={formik} placeholder="enter new password" required={false}/>

                    <FormInput
                        label="First Name" name="first_name" type="text"
                        formik={formik} placeholder="Enter first name"
                    />
                    <FormInput
                        label="Last Name" name="last_name" type="text"
                        formik={formik} placeholder="Enter last name"
                    />
                    <FormInput
                        label="Location" name="location" type="text"
                        formik={formik} placeholder="Enter location"
                    />
                    <FormInput
                        label="Birth Date" name="birth_date" type="date" 
                        formik={formik} placeHOLDER="enter birth date"
                    />
                    <FormInput label="Biography" name="bio" type="textarea"
                        formik={formik} placeholder="Enter Bio"
                        className="span-full"
                    />

                    <button
                        className="submit-btn" type="submit"
                        disabled={!formik.dirty || !formik.isValid}
                    >
                        Save Profile
                    </button>
                </FormWrapper>)
            }
    </>)
}
export default EditProfileForm