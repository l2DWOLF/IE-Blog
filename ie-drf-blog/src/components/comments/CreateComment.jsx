import '../../components/articles/css/article-edit-create.css'
import './css/comments.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import * as yup from "yup";
import { contentField } from "../../utils/validations/yupValidations";
import { successMsg } from "../../utils/toastify/toast";
import LoadingScreen from "../common/loadscreen/LoadingScreen";
import FormWrapper from "../common/forms/FormWrapper";
import { FormInput, FormSelectInput } from "../common/forms/formInput";
import { handleException } from '../../utils/errors/handleException';
import { motion } from 'framer-motion';
import { createComment } from '../../services/commentServices';

function CreateComment({articleId, replyTo, onClose}) {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            content: "",
            status: "publish",
        },
        validationSchema: yup.object({
            content: contentField,
            status: yup.string().required(),
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const payload = values;
                payload.article = articleId;
                payload.reply_to = replyTo;

                console.log(payload);
                
                await createComment(payload);
                successMsg("New Comment Added Succesfully! :)");
            } catch (err) {
                handleException(err, { toast: true, alert: true });
            } finally {
                setIsLoading(false);
            };
        }
    });

    return (
        <motion.div
            className="modal-content"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.50, ease: 'easeOut' }}
        >
        <div className="comment-modal-form">
            <button className="close-btn" onClick={onClose}>X</button>

            {isLoading ? (
                <LoadingScreen />
            ) : (
                <FormWrapper title="New Comment" onSubmit={formik.handleSubmit}>

                    <FormSelectInput
                        label="Status" name="status" multipleAllowed="false" options={["publish", "draft", "archived"]} formik={formik}
                    />
                    <FormInput label="Content" name="content" type="textarea"
                        formik={formik} placeholder="Enter Content" className="span-full"
                    />

                    <button
                        className="submit-btn" type="submit"
                        disabled={!formik.dirty || !formik.isValid}
                    >
                        Submit Comment
                    </button>
                </FormWrapper>)}
        </div>
        </motion.div>
    )
}
export default CreateComment