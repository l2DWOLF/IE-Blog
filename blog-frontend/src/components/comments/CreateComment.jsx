
import './css/comments.css'
import { useState } from 'react';
import { useFormik } from "formik";
import * as yup from "yup";
import { commentContentField } from "../../utils/validations/yupValidations";
import { successMsg } from "../../utils/toastify/toast";
import LoadingScreen from "../common/loadscreen/LoadingScreen";
import FormWrapper from "../common/forms/FormWrapper";
import { FormInput, FormSelectInput } from "../common/forms/FormInput";
import { handleException } from '../../utils/errors/handleException';
import { motion } from 'framer-motion';
import { createComment } from '../../services/commentServices';

function CreateComment({articleId, replyTo, onClose, onCommentAdded}) {
    const [isLoading, setIsLoading] = useState(false);
    
    const formik = useFormik({
        initialValues: {
            content: "",
            status: "publish",
        },
        validationSchema: yup.object({
            content: commentContentField,
            status: yup.string().required(),
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const payload = values;
                payload.article = articleId;
                payload.reply_to = replyTo;
                
                await createComment(payload);
                successMsg("New Comment Added Succesfully! :)");

                if(typeof onCommentAdded === "function"){
                    await onCommentAdded();
                }
                onClose();
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

            {isLoading ? (
                <LoadingScreen />
            ) : (
                <FormWrapper title="New Comment" onSubmit={formik.handleSubmit}>
                    <button className="close-btn" title="close comment editor" type="button" onClick={onClose}>X</button>

                    <FormSelectInput
                        label="Status" name="status" className="status-input" multipleAllowed="false" options={["publish", "draft", "archived"]} formik={formik}
                    />
                    <FormInput label="Content" name="content" type="textarea"
                        formik={formik} placeholder="Enter Content" className="span-full"
                    />

                    <button
                        className="submit-btn" type="submit" title="submit comment/reply"
                        disabled={!formik.dirty || !formik.isValid}
                    >
                        Submit Comment
                    </button>
                </FormWrapper>
            )}
        </div>
    </motion.div>
    )}
export default CreateComment