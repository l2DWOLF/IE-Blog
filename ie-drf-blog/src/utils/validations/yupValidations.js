import * as yup from "yup";

const emailField = yup.string().required().email().min(8, "Email Must contain 8 or more characters")

const pwField = yup.string().required().min(9, "Password Must contain 9 - 30 characters").max(30, "Password must contain less than 30 characters").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=(.*\d){4,})(?=.*[!@#$%^&*-])[A-Za-z\d!@#$%^&*-]{9,30}$/, "Must contain: [1 uppercaseletter, 1 lowercase letter, 4 digits, 1 of the following symbols (!@#$%^&*-)]")

const usernameField = yup.string().required().min(3, "username Must contain 3 or more characters").max(50, "Username Must be less than 50 characters")

const nameField = yup.string().min(2, "Name Must contain 2 or more characters").max(50, "Name Must contain 50 or less characters")

export {emailField, pwField, usernameField, nameField}