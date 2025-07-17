import * as yup from "yup";

const emailField = yup.string().email().min(8, "Email Must contain 8 or more characters")

const pwField = yup.string().required().min(9, "Password Must contain 9 - 30 characters").max(30, "Password must contain less than 30 characters").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=(.*\d){4,})(?=.*[!@#$%^&*-])[A-Za-z\d!@#$%^&*-]{9,30}$/, "Must contain: [1 uppercaseletter, 1 lowercase letter, 4 digits, 1 of the following symbols (!@#$%^&*-)]")

const updatePwField = yup.string().min(9, "Password Must contain 9 - 30 characters").max(30, "Password must contain less than 30 characters").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=(.*\d){4,})(?=.*[!@#$%^&*-])[A-Za-z\d!@#$%^&*-]{9,30}$/, "Must contain: [1 uppercaseletter, 1 lowercase letter, 4 digits, 1 of the following symbols (!@#$%^&*-)]")

const confirmPwField = yup.string().required().min(9, "Password Must contain 9 - 30 characters").max(30, "Password must contain less than 30 characters").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=(.*\d){4,})(?=.*[!@#$%^&*-])[A-Za-z\d!@#$%^&*-]{9,30}$/, "Must contain: [1 uppercaseletter, 1 lowercase letter, 4 digits, 1 of the following symbols (!@#$%^&*-)]").oneOf([yup.ref('password'), null], "Passwords must match.")

const usernameField = yup.string().required().min(3, "username Must contain 3 or more characters").max(50, "Username Must be less than 50 characters")

const nameField = yup.string().min(2, "Name Must contain 2 or more characters").max(50, "Name Must contain 50 or less characters")

const titleField = yup.string().required().min(5, "Title must contain 5 or more characters").max(100, "Title must contain less than 100 characters.").matches(/^[a-zA-Z0-9].*$/, "Must begin with a letter or number")

const contentField = yup.string().required().min(15, "must contain 15 or more characters").max(4096, "must contain less than 4096 characters")

const commentContentField = yup.string().required().min(2, "must contain 15 or more characters").max(1028, "must contain less than 4096 characters")

const bioField = yup.string().min(3, "Biography must contain 5 or more characters.").max(500, "Biography must contain less than 500 characters")

const dateField = yup.date().nullable().max(new Date(), "Birth date canno't be in the future")

export {emailField, pwField, confirmPwField, updatePwField, 
        usernameField, nameField, bioField, dateField,
        titleField, contentField, commentContentField
}