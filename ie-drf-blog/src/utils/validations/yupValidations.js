import * as yup from "yup";

const emailField = yup.string().required().email().min(5, "Email must contain more than 5 characters")

const pwField = yup.string().required().min(9, "Password Must contain 9 9 - 30 characters").max(20, "Password must contain less than 20 characters").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=(.*\d){4,})(?=.*[!@#$%^&*-])[A-Za-z\d!@#$%^&*-]{9,30}$/, "Must contain: [1 uppercaseletter, 1 lowercase letter, 4 digits, 1 of the following symbols (!@#$%^&*-)]")

export {emailField, pwField}