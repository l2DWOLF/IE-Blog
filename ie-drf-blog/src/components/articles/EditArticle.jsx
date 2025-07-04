import './css/article-edit-create.css'
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from "formik";
import * as yup from "yup";
import { contentField, titleField } from "../../utils/validations/yupValidations";
import { successMsg } from "../../utils/toastify/toast";
import LoadingScreen from "../common/loadscreen/LoadingScreen";
import FormWrapper from "../common/forms/FormWrapper";
import { FormInput, FormSelectInput } from "../common/forms/formInput";
import { handleException } from '../../utils/errors/handleException';
import { FormTagSelector } from "../common/forms/FormTagSelector";
import { getArticle, updateArticle } from "../../services/articleServices";



function EditArticle() {
    const {id} = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [initialValues, setInitialValues] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadArticle = async () => {
            try {
                const article = await getArticle(id);
                setInitialValues({
                    title: article.title,
                    content: article.content,
                    status: article.status,
                    tags: article.tags,
                })
            } catch (err) {
                handleException(err, { toast: true, alert: true})
            } finally {
                setIsLoading(false);
            }  
        };
        loadArticle();
    }, [id])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues || {
            title: "",
            content: "",
            status: "",
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
                await updateArticle(id, values);
                successMsg("Article Edited Succesfully! :)")
                navigate("/")
            } catch (err) {
                handleException(err, { toast: true, alert: true });
            } finally {
                setIsLoading(false);
            };
        }
    });

    return (
        <div className="add-article-section">
            <div className="mirror-wrapper">
                <h1 className="mirrored" data-text="Edit Article">
                    Edit Article</h1>
            </div>

            {isLoading ? (
                <LoadingScreen />
            ) : (
                <FormWrapper title="Edit Article Form" onSubmit={formik.handleSubmit}>

                    <FormInput
                        label="Title" name="title" type="text"
                        formik={formik} placeholder="Enter Title"
                    />
                    <FormSelectInput
                        label="Status" name="status" multipleAllowed="false" options={["publish", "draft", "archived"]} formik={formik}
                    />
                    <FormInput label="Content" name="content" type="textarea"
                        formik={formik} placeholder="Enter Content" className="span-full"
                    />
                    <FormTagSelector
                        formik={formik} label="Categories" name="tags" options={['Python', 'C++', 'JavaScript', 'React', 'Node', 'SQL',
                            'Django', 'MongoDB', 'HTML', 'CSS', 'Computer Science'
                        ]}
                    />

                    <button
                        className="submit-btn" type="submit"
                        disabled={!formik.dirty || !formik.isValid}
                    >
                        Submit Edited Article
                    </button>
                </FormWrapper>)}
        </div>
    )
}
export default EditArticle