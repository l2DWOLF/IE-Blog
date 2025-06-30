import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import * as yup from "yup";
import {  contentField, titleField } from "../../utils/validations/yupValidations";
import { successMsg } from "../../utils/toastify/toast";
import LoadingScreen from "../common/loadscreen/LoadingScreen";
import FormWrapper from "../common/forms/FormWrapper";
import { FormInput, FormSelectInput } from "../common/forms/formInput";
import { handleException } from '../../utils/errors/handleException';
import { FormTagSelector } from "../common/forms/FormTagSelector";
import { createArticle } from "../../services/articleServices";



function CreateArticle() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            title: "",
            content: "",
            status: "publish",
            tags: [],
        },
        validationSchema: yup.object({
            title: titleField,
            content: contentField,
            status: yup.string().required(),
            tags: yup.array().of(yup.string()).min(1, "Pick at least one Category Tag").ensure().required(), 
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                console.log(values);
                
                await createArticle(values);
                successMsg("New Article Added Succesfully! :)")
                navigate("/")
            } catch (err) {
                handleException(err, { toast: true, alert: true });
            } finally {
                setIsLoading(false);
            };
        }
    }); 

    return (
        <div className="register-section">
            <h1>Create Article</h1>

            {isLoading ? (
                <LoadingScreen />
            ) : (
                <FormWrapper title="New Article Form" onSubmit={formik.handleSubmit}>

                    <FormInput
                        label="Title" name="title" type="text"
                        formik={formik} placeholder="Enter Title"
                    />
                    <FormSelectInput
                        label="Status" name="status" multipleAllowed="false" options={["publish", "draft", "archived"]} formik={formik}
                    />
                    <FormInput label="Content" name="content" type="text"
                        formik={formik} placeholder="Enter Content"
                    />
                    <FormTagSelector 
                            formik={formik} label="Categories" name="tags" options={["C++", "Django", "Python", "SQL", "JavaScript", "React"]}
                    />

                    <button
                        className="submit-btn" type="submit"
                        disabled={!formik.dirty || !formik.isValid}
                    >
                        Submit Article
                    </button>
                </FormWrapper>)}
        </div>
    )
}
export default CreateArticle
