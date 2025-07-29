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
import { bioField, dateField, nameField, updateEmailField, updatePwField } from '../../../utils/validations/yupValidations';
import { updateUserProfile } from '../../../services/userServices';


function EditProfileForm( {profileObj, refetch, onCancel} ) {
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
                    warningMsg("You don't have permissions to edit this user, you may only edit/delete your own user - redirecting to homepage.");
                    setIsLoading(false);
                    navigate('/');
                }
                else {
                    setShowContent(true);
                    setInitialValues({
                        email: profileObj?.email || "",
                        password: "",
                        first_name: profileObj?.first_name || "",
                        last_name: profileObj?.last_name || "",
                        location: profileObj?.location || "",
                        bio: profileObj?.bio || "",
                        birth_date: profileObj?.birth_date || "",
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
            birth_date: profileObj?.birth_date
                ? new Date(profileObj?.birth_date).toISOString().split("T")[0]
            : "",
            bio: "",
        },
        validationSchema: yup.object({
            email: updateEmailField,
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
                
                if(user?.is_staff || user?.is_superuser){
                    if(profileObj?.id && profileObj?.id !== user?.id){
                        payload.user_id = profileObj?.id;
                    };
                };

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
                    <button className="close-btn" type="button" title="Close profile editor" onClick={onCancel}>X</button>
                    
                    {profileObj?.id === user?.id && <>
                        <FormInput label="Email" name="email" type="email"
                            formik={formik} placeholder="enter email" />

                        <FormInput label="change password" name="password" type="password"
                        formik={formik} placeholder="enter new password" required={false}/>
                    </>}
                    

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
                        className="submit-btn" type="submit" title="Submit edited profile"
                        disabled={!formik.dirty || !formik.isValid}
                    >
                        Save Profile
                    </button>
                </FormWrapper>)
            }
    </>)
}
export default EditProfileForm